# ChipForge Context Documentation

## Overview
This document summarizes the core contracts and architectural decisions made during the refactoring of ChipForge to support production-grade schematic→HDL generation.

## Core Contracts

### Design Types (`/core/contracts/design-types.ts`)
The design types define the contract between the schematic editor and HDL generation engine:

- **CfDesign**: Complete design representation with components, nets, buses, constraints, and documentation
- **CfComponent**: Individual components with pins, parameters, and compliance information
- **CfPin**: Pin definitions with direction, width, and optional bus role assignments
- **CfNet**: Signal nets connecting component pins
- **CfBus**: Bus protocol definitions (AHB, AXI, APB, Custom)
- **CfConstraintSet**: Timing and electrical constraints
- **CfWaveformPlan**: Test waveform definitions with timing expressions

### Key Design Decisions

#### 1. Single Clock Domain Semantics
- **Decision**: Enforce single rising-edge clock semantics for AHB designs
- **Rationale**: Simplifies timing analysis and reduces clock domain crossing complexity
- **Implementation**: `CfClock.stableBetweenClock` flag and validation in AHB ERC

#### 2. AHB Protocol Compliance
- **Decision**: Implement strict AHB specification compliance checking
- **Rationale**: Ensures generated HDL meets industry standards and reduces integration issues
- **Implementation**: Comprehensive ERC validation in `/core/erc/ahb-erc.ts`

#### 3. Flexible Waveform Timing
- **Decision**: Support both absolute timing (`t+10ns`) and relative timing (`rise(HCLK)*3`)
- **Rationale**: Enables complex test scenarios while maintaining readability
- **Implementation**: `WaveStep.at` field with string-based timing expressions

#### 4. Bus Role Assignment
- **Decision**: Allow pins to have specific bus roles (manager, subordinate, decoder, mux)
- **Rationale**: Enables automatic HDL generation based on component function
- **Implementation**: `CfPin.busRole` field with predefined role types

## State Management

### HDL Design Store (`/core/store/hdlDesignStore.ts`)
Zustand-based state management with the following key features:

- **Design Loading**: JSON validation and structure verification
- **Component Management**: CRUD operations with automatic ID generation
- **Net Management**: Pin connection/disconnection with automatic net creation
- **Constraint Management**: Clock, reset, and bus configuration
- **Export Functionality**: Multi-format export (JSON, YAML)

### Key Store Decisions

#### 1. Immutable Updates
- **Decision**: Use immutable state updates for all design modifications
- **Rationale**: Enables undo/redo functionality and simplifies debugging
- **Implementation**: Spread operator pattern with automatic timestamp updates

#### 2. Automatic Validation
- **Decision**: Validate design structure on load and modification
- **Rationale**: Prevents invalid states from propagating through the system
- **Implementation**: `validateDesign()` helper function with comprehensive checks

## ERC Validation

### AHB ERC (`/core/erc/ahb-erc.ts`)
Electrical Rule Check implementation for AHB bus compliance:

#### Validation Rules Implemented
1. **Required Signals**: HCLK, HRESETn, HADDR, HRDATA, HWDATA, HTRANS, HREADY, HRESP, HWRITE, HSIZE
2. **Signal Widths**: Enforce AHB specification requirements (e.g., HADDR=32, HTRANS=2, HRESP=2)
3. **Decode Granularity**: Minimum 1KB decode granularity for HSEL signals
4. **Reset Configuration**: Active-low reset with synchronous deassert recommendation
5. **Clock Domain**: Single clock domain warning for multiple clocks

#### Key Validation Decisions

##### 1. Strict vs. Lenient Validation
- **Decision**: Implement strict validation with warnings for non-critical issues
- **Rationale**: Ensures AHB compliance while providing guidance for best practices
- **Implementation**: Separate `errors` and `warnings` arrays in `ERCResult`

##### 2. Address Range Parsing
- **Decision**: Support multiple address range formats (numeric, "1K", "2KB", "1024")
- **Rationale**: Accommodates different component parameter conventions
- **Implementation**: Flexible `parseAddressRange()` function with unit conversion

## File Formats

### JSON Schemas
Three JSON schemas define the file format contracts:

1. **Design Schema** (`/schemas/design.schema.json`): Validates complete design files
2. **Waveform Schema** (`/schemas/waveform.schema.json`): Validates test waveform files
3. **Constraints Schema** (`/schemas/constraints.schema.json`): Validates constraint files

#### Schema Design Decisions

##### 1. Strict Validation
- **Decision**: Use JSON Schema Draft-07 with strict type checking
- **Rationale**: Catches format errors early and provides clear validation messages
- **Implementation**: Comprehensive schema definitions with required fields and type constraints

##### 2. Extensible Properties
- **Decision**: Allow additional properties in component parameters and bus properties
- **Rationale**: Supports vendor-specific extensions while maintaining core compatibility
- **Implementation**: `additionalProperties: true` for flexible fields

## Testing Strategy

### Test Coverage
Comprehensive test coverage for all core functionality:

1. **Design Types Tests** (`/core/contracts/__tests__/design-types.spec.ts`): Interface validation and edge cases
2. **AHB ERC Tests** (`/core/erc/__tests__/ahb-erc.spec.ts`): Validation logic and error detection

#### Testing Decisions

##### 1. Comprehensive Test Cases
- **Decision**: Test all validation scenarios including edge cases and error conditions
- **Rationale**: Ensures robust validation and prevents regressions
- **Implementation**: Extensive test suite with positive and negative test cases

##### 2. Mock Data Generation
- **Decision**: Use realistic test data that mirrors production AHB designs
- **Rationale**: Tests real-world scenarios and validates actual use cases
- **Implementation**: Complete AHB design fixtures with all required signals

## Future Considerations

### Extensibility
The current architecture supports future enhancements:

1. **Additional Bus Protocols**: AXI, APB support through `CfBus.kind` extension
2. **Advanced Timing**: Complex timing constraints through `CfConstraintSet.timing`
3. **Compliance Standards**: Additional protocol compliance through `CfCompliance.standard`

### Performance
Current implementation prioritizes correctness over performance:

1. **Validation**: Comprehensive validation on every operation
2. **State Updates**: Full state recreation for all modifications
3. **Export**: Synchronous export with full data serialization

Future optimizations may include:
- Incremental validation
- Lazy loading for large designs
- Background export processing

## Conclusion

This refactoring establishes a solid foundation for production-grade schematic→HDL generation in ChipForge. The core contracts provide clear interfaces between components, the state management ensures data integrity, and the ERC validation enforces industry standards. The architecture is designed for extensibility while maintaining strict compliance with established protocols. 