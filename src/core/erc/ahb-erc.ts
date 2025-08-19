import { CfDesign, CfComponent, CfNet, CfBus } from '../contracts/design-types';

export interface ERCResult {
  errors: string[];
  warnings: string[];
}

export interface AHBValidationContext {
  hclk?: CfNet;
  hresetn?: CfNet;
  haddr?: CfNet;
  hrdata?: CfNet;
  hwdata?: CfNet;
  htrans?: CfNet;
  hready?: CfNet;
  hresp?: CfNet;
  hwrite?: CfNet;
  hsize?: CfNet;
  hselSignals: CfNet[];
}

/**
 * Validates AHB bus compliance for a ChipForge design
 * Enforces AMBA AHB specification requirements
 */
export function validateAHB(design: CfDesign): ERCResult {
  const result: ERCResult = { errors: [], warnings: [] };
  
  if (!design) {
    result.errors.push('No design provided for validation');
    return result;
  }

  // Find AHB buses
  const ahbBuses = design.buses.filter(bus => bus.kind === 'AHB');
  if (ahbBuses.length === 0) {
    result.warnings.push('No AHB buses found in design');
    return result;
  }

  // Validate each AHB bus
  for (const bus of ahbBuses) {
    const busValidation = validateAHBBus(bus, design);
    result.errors.push(...busValidation.errors);
    result.warnings.push(...busValidation.warnings);
  }

  // Global AHB validation
  const globalValidation = validateGlobalAHB(design);
  result.errors.push(...globalValidation.errors);
  result.warnings.push(...globalValidation.warnings);

  return result;
}

/**
 * Validates a specific AHB bus instance
 */
function validateAHBBus(bus: CfBus, design: CfDesign): ERCResult {
  const result: ERCResult = { errors: [], warnings: [] };
  
  // Extract AHB signals from the bus
  const context = extractAHBContext(bus, design);
  
  // Required signal validation
  if (!context.hclk) {
    result.errors.push(`AHB bus ${bus.id}: Missing HCLK signal`);
  }
  
  if (!context.hresetn) {
    result.errors.push(`AHB bus ${bus.id}: Missing HRESETn signal`);
  } else {
    // Validate HRESETn polarity
    const resetComponent = findComponentByPin(design, context.hresetn.id);
    if (resetComponent) {
      const resetPin = resetComponent.pins.find(pin => pin.netId === context.hresetn!.id);
      if (resetPin && resetPin.name.toLowerCase().includes('reset')) {
        // Check if it's active low (should be HRESETn)
        if (!resetPin.name.includes('n') && !resetPin.name.includes('_n')) {
          result.warnings.push(`AHB bus ${bus.id}: HRESETn should be active-low (check pin naming)`);
        }
      }
    }
  }

  if (!context.haddr) {
    result.errors.push(`AHB bus ${bus.id}: Missing HADDR signal`);
  } else {
    // Validate HADDR width (typically 32 bits)
    if (context.haddr.width !== 32) {
      result.warnings.push(`AHB bus ${bus.id}: HADDR width is ${context.haddr.width}, expected 32`);
    }
  }

  if (!context.hrdata) {
    result.errors.push(`AHB bus ${bus.id}: Missing HRDATA signal`);
  } else {
    // Validate HRDATA width (should match data bus width)
    if (context.hrdata.width !== 32 && context.hrdata.width !== 64) {
      result.warnings.push(`AHB bus ${bus.id}: HRDATA width ${context.hrdata.width} is non-standard`);
    }
  }

  if (!context.hwdata) {
    result.errors.push(`AHB bus ${bus.id}: Missing HWDATA signal`);
  } else {
    // Validate HWDATA width matches HRDATA
    if (context.hrdata && context.hwdata.width !== context.hrdata.width) {
      result.errors.push(`AHB bus ${bus.id}: HWDATA width ${context.hwdata.width} doesn't match HRDATA width ${context.hrdata.width}`);
    }
  }

  if (!context.htrans) {
    result.errors.push(`AHB bus ${bus.id}: Missing HTRANS signal`);
  } else {
    // Validate HTRANS width (2 bits)
    if (context.htrans.width !== 2) {
      result.errors.push(`AHB bus ${bus.id}: HTRANS width is ${context.htrans.width}, expected 2`);
    }
  }

  if (!context.hready) {
    result.errors.push(`AHB bus ${bus.id}: Missing HREADY signal`);
  }

  if (!context.hresp) {
    result.errors.push(`AHB bus ${bus.id}: Missing HRESP signal`);
  } else {
    // Validate HRESP width (2 bits)
    if (context.hresp.width !== 2) {
      result.errors.push(`AHB bus ${bus.id}: HRESP width is ${context.hresp.width}, expected 2`);
    }
  }

  if (!context.hwrite) {
    result.errors.push(`AHB bus ${bus.id}: Missing HWRITE signal`);
  } else {
    // Validate HWRITE width (1 bit)
    if (context.hwrite.width !== 1) {
      result.errors.push(`AHB bus ${bus.id}: HWRITE width is ${context.hwrite.width}, expected 1`);
    }
  }

  if (!context.hsize) {
    result.errors.push(`AHB bus ${bus.id}: Missing HSIZE signal`);
  } else {
    // Validate HSIZE width (3 bits)
    if (context.hsize.width !== 3) {
      result.errors.push(`AHB bus ${bus.id}: HSIZE width is ${context.hsize.width}, expected 3`);
    }
  }

  // Validate HSEL signals and decode granularity
  if (context.hselSignals.length === 0) {
    result.warnings.push(`AHB bus ${bus.id}: No HSEL signals found (decoder may be missing)`);
  } else {
    // Check decode granularity (1KB minimum)
    const decodeValidation = validateDecodeGranularity(context.hselSignals, design);
    result.errors.push(...decodeValidation.errors);
    result.warnings.push(...decodeValidation.warnings);
  }

  return result;
}

/**
 * Validates global AHB design rules
 */
function validateGlobalAHB(design: CfDesign): ERCResult {
  const result: ERCResult = { errors: [], warnings: [] };

  // Check for single clock domain
  const clocks = design.constraints.clocks;
  if (clocks.length > 1) {
    result.warnings.push('Multiple clocks detected - ensure proper clock domain crossing');
  }

  // Check for proper reset configuration
  const resets = design.constraints.resets;
  const ahbResets = resets.filter(r => r.name === 'HRESETn' || r.name.toLowerCase().includes('reset'));
  if (ahbResets.length === 0) {
    result.warnings.push('No HRESETn reset signal configured');
  } else {
    for (const reset of ahbResets) {
      if (reset.active !== 'low') {
        result.warnings.push(`Reset ${reset.name} is active-${reset.active}, AHB typically uses active-low`);
      }
      if (!reset.syncDeassert) {
        result.warnings.push(`Reset ${reset.name} has async deassert, consider sync deassert for AHB`);
      }
    }
  }

  return result;
}

/**
 * Extracts AHB signal context from a bus
 */
function extractAHBContext(bus: CfBus, design: CfDesign): AHBValidationContext {
  const context: AHBValidationContext = {
    hselSignals: [],
  };

  // Find nets associated with this bus
  for (const signal of bus.signals) {
    const net = design.nets.find(n => n.id === signal.netId);
    if (!net) continue;

    const netName = net.name.toUpperCase();
    
    if (netName === 'HCLK') context.hclk = net;
    else if (netName === 'HRESETN') context.hresetn = net;
    else if (netName === 'HADDR') context.haddr = net;
    else if (netName === 'HRDATA') context.hrdata = net;
    else if (netName === 'HWDATA') context.hwdata = net;
    else if (netName === 'HTRANS') context.htrans = net;
    else if (netName === 'HREADY') context.hready = net;
    else if (netName === 'HRESP') context.hresp = net;
    else if (netName === 'HWRITE') context.hwrite = net;
    else if (netName === 'HSIZE') context.hsize = net;
    else if (netName.startsWith('HSEL')) context.hselSignals.push(net);
  }

  return context;
}

/**
 * Validates decode granularity for HSEL signals
 * AHB specification requires minimum 1KB decode granularity
 */
function validateDecodeGranularity(hselSignals: CfNet[], design: CfDesign): ERCResult {
  const result: ERCResult = { errors: [], warnings: [] };

  if (hselSignals.length < 2) {
    return result; // Single HSEL doesn't need granularity validation
  }

  // Find decoder component
  const decoderComponent = findDecoderComponent(design);
  if (!decoderComponent) {
    result.warnings.push('Decoder component not found - cannot validate decode granularity');
    return result;
  }

  // Check if decoder has address range parameters
  const addressRange = decoderComponent.params.addressRange || decoderComponent.params.addrRange;
  if (addressRange) {
    const range = parseAddressRange(addressRange);
    if (range && range < 1024) { // 1KB = 1024 bytes
      result.errors.push(`Decoder decode granularity ${range} bytes is below AHB minimum of 1KB`);
    }
  } else {
    result.warnings.push('Decoder address range not specified - cannot validate decode granularity');
  }

  return result;
}

/**
 * Finds component by pin net ID
 */
function findComponentByPin(design: CfDesign, netId: string): CfComponent | undefined {
  return design.components.find(comp =>
    comp.pins.some(pin => pin.netId === netId)
  );
}

/**
 * Finds decoder component in design
 */
function findDecoderComponent(design: CfDesign): CfComponent | undefined {
  return design.components.find(comp =>
    comp.type.toLowerCase().includes('decoder') ||
    comp.name.toLowerCase().includes('decoder') ||
    comp.pins.some(pin => pin.busRole === 'decoder')
  );
}

/**
 * Parses address range parameter
 */
function parseAddressRange(range: any): number | null {
  if (typeof range === 'number') return range;
  if (typeof range === 'string') {
    // Try to parse common formats like "1K", "2KB", "1024"
    const match = range.toString().match(/^(\d+)([KM]?B?)$/i);
    if (match) {
      const value = parseInt(match[1]);
      const unit = match[2].toUpperCase();
      if (unit === 'KB' || unit === 'K') return value * 1024;
      if (unit === 'MB' || unit === 'M') return value * 1024 * 1024;
      return value;
    }
  }
  return null;
} 