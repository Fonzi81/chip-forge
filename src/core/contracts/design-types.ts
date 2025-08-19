/**
 * Core design types for ChipForge schematic→HDL generation
 * Defines the contract between schematic editor and HDL generation engine
 */

/**
 * Complete design representation containing all components, connections, and constraints
 * @doc A ChipForge design is the top-level container that holds everything needed to generate HDL code.
 * It includes components (like processors, memory, and peripherals), the nets that connect them,
 * bus definitions, timing constraints, and documentation references.
 */
export interface CfDesign {
  /** 
   * Unique identifier for the design
   * @doc Design IDs follow a naming convention like "cf_ahb_soc", "cf_memory_subsystem",
   * or "cf_peripheral_cluster". These IDs are used for file naming, version control,
   * and design management.
   */
  id: string;
  /** 
   * Design metadata and version information
   * @doc Metadata provides essential information about the design, including name,
   * description, version, creation date, and author. This information is crucial
   * for design management and collaboration.
   */
  meta: {
    /** 
     * Human-readable design name
     * @doc Design names should be descriptive and indicate the purpose, such as
     * "AHB System-on-Chip", "Memory Controller", or "Peripheral Bridge".
     */
    name: string;
    /** 
     * Optional design description
     * @doc Descriptions provide context about the design's purpose, functionality,
     * and key features. This helps other engineers understand the design intent.
     */
    description?: string;
    /** 
     * Design version following semantic versioning
     * @doc Version numbers follow the format "major.minor.patch" (e.g., "1.0.0").
     * Major versions indicate incompatible changes, minor versions add functionality,
     * and patch versions fix bugs.
     */
    version: string;
    /** 
     * ISO timestamp when the design was created
     * @doc Creation timestamps help track design history and establish baseline
     * dates for project planning and milestone tracking.
     */
    created: string;
    /** 
     * ISO timestamp when the design was last modified
     * @doc Modification timestamps help track design evolution and identify
     * when changes were made for debugging and version control.
     */
    modified: string;
    /** 
     * Optional author or team information
     * @doc Author information helps establish ownership and provides contact
     * details for questions about the design implementation.
     */
    author?: string;
  };
  /** 
   * Components that make up the design
   * @doc Components are the functional blocks of your design, such as processors,
   * memory controllers, peripherals, and bus infrastructure. Each component
   * has pins for electrical connections and parameters for configuration.
   */
  components: CfComponent[];
  /** 
   * Signal nets that connect component pins
   * @doc Nets are the electrical connections between components, carrying
   * signals like HCLK, HADDR, HRDATA, HWDATA, and control signals. Proper
   * net connections ensure correct signal routing and bus operation.
   */
  nets: CfNet[];
  /** 
   * Bus protocol definitions
   * @doc Buses define the communication protocols between components, such as
   * AHB, AXI, or APB. Each bus specifies which signals are used and how
   * components interact according to the protocol standard.
   */
  buses: CfBus[];
  /** 
   * Design constraints and requirements
   * @doc Constraints define the electrical and timing requirements for your
   * design, including clock frequencies, reset behavior, timing relationships,
   * and parity checking for data integrity.
   */
  constraints: CfConstraintSet;
  /** 
   * Documentation references
   * @doc Documentation links your design to external specifications, datasheets,
   * and user guides. This provides context for design decisions and helps
   * ensure compliance with industry standards.
   */
  docs: CfDocRef[];
}

/**
 * Individual component in a design with pins, parameters, and visual representation
 * @doc A component represents a functional block in your design, such as a CPU, memory controller,
 * or peripheral device. Each component has pins for electrical connections, parameters for
 * configuration, and visual elements for the schematic editor.
 */
export interface CfComponent {
  /** 
   * Unique identifier for the component
   * @doc Component IDs follow a naming convention like "cf_cpu_core", "cf_memory_ctrl",
   * or "cf_ahb_bridge". These IDs are used throughout the design to reference
   * components and establish connections.
   */
  id: string;
  /** 
   * Human-readable component name
   * @doc Component names should be descriptive and follow AHB conventions when possible.
   * Examples: "AHB Master", "Memory Controller", "Address Decoder", "Data Mux".
   */
  name: string;
  /** 
   * Component type or category
   * @doc Component types help categorize functionality: "bus_master", "bus_slave",
   * "decoder", "mux", "bridge", "memory", "peripheral". This enables automatic
   * validation and HDL generation based on component role.
   */
  type: string;
  /** 
   * Electrical connection points for the component
   * @doc Pins define how the component connects to other components and the bus.
   * AHB components typically have pins for HCLK, HRESETn, HADDR, HRDATA, HWDATA,
   * HTRANS, HREADY, HRESP, HWRITE, HSIZE, and HSELx signals.
   */
  pins: CfPin[];
  /** 
   * Component configuration parameters
   * @doc Parameters define component behavior and capabilities. For AHB components,
   * this might include address ranges, data widths, burst capabilities, or
   * protocol-specific options.
   */
  params: Record<string, number | string | boolean>;
  /** 
   * Visual representation for the schematic editor
   * @doc The view defines how the component appears in the schematic editor.
   * icon2d is required for 2D schematics, while model3d is optional for
   * 3D visualization.
   */
  view: {
    icon2d: string;
    model3d?: string;
  };
  /** 
   * Protocol compliance information
   * @doc Compliance information indicates which AHB standard the component follows
   * and any deviations or special features. This enables automatic validation
   * and ensures proper integration.
   */
  compliance?: CfCompliance;
}

/**
 * Pin definition for a component with direction, width, and optional bus role
 * @doc A pin is an electrical connection point on a component. It defines the signal direction
 * (input, output, or bidirectional), the number of bits it can carry, and optionally its role
 * in bus protocols like AHB or AXI.
 */
export interface CfPin {
  /** 
   * Unique identifier for the pin
   * @doc Pin IDs follow a naming convention like "hclk", "haddr", "hrdata", "hwdata",
   * "htrans", "hready", "hresp", "hwrite", "hsize", or "hsel". These IDs are used
   * to reference pins within components and establish connections to nets.
   */
  id: string;
  /** 
   * Pin name, often following AHB conventions
   * @doc Pin names follow AHB standards: HCLK (clock), HRESETn (reset), HADDR (address),
   * HRDATA (read data), HWDATA (write data), HTRANS (transfer type), HREADY (ready),
   * HRESP (response), HWRITE (write control), HSIZE (transfer size), HSELx (slave select).
   * Understanding these names helps you connect components correctly.
   */
  name: string;
  /** 
   * Signal direction relative to the component
   * @doc 'in' means the component receives this signal, 'out' means it drives the signal,
   * and 'inout' means it can do both (typically used for bidirectional data buses).
   */
  dir: 'in' | 'out' | 'inout';
  /** 
   * Number of bits the pin can carry
   * @doc Width determines the data capacity: 1 bit for control signals, 32 bits for
   * addresses, and 32/64 bits for data. Proper width matching is crucial for
   * correct bus operation.
   */
  width: number;
  /** 
   * Reference to the connected net
   * @doc The netId links this pin to a specific net in the design, enabling
   * electrical connections between components. When a pin is connected to a net,
   * signals can flow between the component and other components on the same net.
   * Unconnected pins have undefined netId.
   */
  netId?: string;
  /** 
   * Role of this pin in bus protocols
   * @doc Bus roles define how components interact: 'manager' initiates transfers,
   * 'subordinate' responds to transfers, 'decoder' selects which subordinate to use,
   * and 'mux' routes data between multiple sources.
   * 
   * Bus Roles Explained:
   * - manager: Initiates bus transactions (like a CPU or DMA controller)
   * - subordinate: Responds to bus transactions (like memory or peripherals)
   * - decoder: Address decoder that generates HSELx signals for slave selection
   * - mux: Multiplexer that routes HRDATA/HRESP/HREADYOUT from selected slave
   */
  busRole?: 'manager' | 'subordinate' | 'decoder' | 'mux';
}

/**
 * Signal net connecting multiple component pins
 * @doc A net represents an electrical connection between multiple pins. It defines the signal
 * name, width (number of bits), and which component pins are connected together. Nets are
 * the "wires" that carry signals between components in your design.
 */
export interface CfNet {
  /** 
   * Unique identifier for the net
   * @doc Net IDs follow a naming convention like "net_hclk", "net_haddr", "net_hrdata",
   * or "net_hwdata". These IDs are used to reference nets throughout the design
   * and establish connections between components.
   */
  id: string;
  /** 
   * Net name, often following AHB conventions
   * @doc Net names typically match the AHB signal names they carry: HCLK (clock),
   * HADDR (address), HRDATA (read data), HWDATA (write data), HTRANS (transfer type),
   * HREADY (ready), HRESP (response), HWRITE (write control), HSIZE (transfer size),
   * HSELx (slave select). Clear naming helps you trace signal flow through your design.
   */
  name: string;
  /** 
   * Number of bits the net can carry
   * @doc Width must match the connected pin widths. AHB uses: 1 bit for control signals
   * (HCLK, HRESETn, HREADY, HWRITE), 2 bits for HTRANS and HRESP, 3 bits for HSIZE,
   * 32 bits for HADDR, and 32/64 bits for HRDATA/HWDATA.
   */
  width: number;
  /** 
   * Component pins connected to this net
   * @doc Each endpoint specifies which component and pin is connected to this net.
   * A net can connect multiple pins, creating a shared signal path between components.
   * 
   * AHB Net Connections:
   * - Clock nets (HCLK): Connect to all components for timing synchronization
   * - Reset nets (HRESETn): Connect to all components for initialization
   * - Address nets (HADDR): Connect master outputs to slave inputs
   * - Data nets (HRDATA/HWDATA): Connect between masters and slaves
   * - Control nets (HTRANS, HWRITE, HSIZE): Connect master outputs to slave inputs
   * - Response nets (HREADY, HRESP): Connect slave outputs to master inputs
   * - Select nets (HSELx): Connect decoder outputs to slave inputs
   */
  endpoints: { componentId: string; pinId: string }[];
}

/**
 * Bus protocol definition with associated signals and properties
 * @doc A bus defines a communication protocol between components, such as AHB, AXI, or APB.
 * It specifies which signals are used for the protocol and any additional properties needed
 * for proper operation. Buses enable standardized communication between different parts of your design.
 */
export interface CfBus {
  /** 
   * Unique identifier for the bus
   * @doc Bus IDs follow a naming convention like "bus_ahb_system", "bus_axi_peripheral",
   * or "bus_apb_slow". These IDs help organize multiple buses in complex designs
   * and enable proper signal routing between different bus domains.
   */
  id: string;
  /** 
   * Bus protocol type
   * @doc AHB (Advanced High-performance Bus) is the primary system bus for high-speed
   * data transfers. It supports single-clock transfers, burst operations, and multiple
   * masters. AXI (Advanced eXtensible Interface) offers higher performance with
   * out-of-order transfers. APB (Advanced Peripheral Bus) is for low-speed peripherals.
   * 
   * AHB Features:
   * - Single-clock transfers with address and data phases
   * - Support for wait states via HREADY signal
   * - Burst transfers for efficient memory access
   * - Multiple masters with arbitration
   * - Error responses via HRESP signal
   */
  kind: 'AHB' | 'AXI' | 'APB' | 'Custom';
  /** 
   * Signals associated with this bus protocol
   * @doc Each signal reference defines the role (clock, data, address, control) and
   * direction (master/slave) for that signal. AHB requires specific signals like
   * HCLK, HADDR, HRDATA, HWDATA, HTRANS, HREADY, HRESP, HWRITE, HSIZE, and HSELx.
   */
  signals: CfNetRef[];
  /** 
   * Additional bus-specific properties
   * @doc Properties can include protocol version, burst capabilities, data widths,
   * and other configuration options specific to the bus type.
   * 
   * Common AHB Properties:
   * - protocol: "AMBA AHB v2.0" or "AMBA AHB5"
   * - maxBurst: Maximum burst length (e.g., 16)
   * - dataWidth: Bus data width (32 or 64)
   * - addressWidth: Bus address width (typically 32)
   * - supportsSplit: Whether split transactions are supported
   * - supportsRetry: Whether retry responses are supported
   * - vendorExtensions: Any vendor-specific features
   */
  properties: Record<string, any>;
}

/**
 * Reference to a net within a bus with its role and direction
 * @doc A net reference connects a specific signal net to a bus protocol. It defines the
 * role of that signal (like clock, data, or address) and whether the component acts as
 * a master (initiator) or slave (responder) for that signal.
 */
export interface CfNetRef {
  /** 
   * Reference to the net carrying this signal
   * @doc The netId links this bus signal reference to the actual net in the design.
   * This enables the bus to reference specific nets like "net_hclk" or "net_haddr"
   * and establish the connection between bus protocol and physical connections.
   */
  netId: string;
  /** 
   * Role of this signal in the bus protocol
   * @doc Common AHB roles include: 'clock' (HCLK timing reference), 'reset' (HRESETn),
   * 'address' (HADDR target location), 'read_data' (HRDATA from slave), 'write_data' (HWDATA to slave),
   * 'transfer' (HTRANS operation type), 'ready' (HREADY slave response), 'response' (HRESP status),
   * 'write' (HWRITE read/write control), 'size' (HSIZE transfer size), 'select' (HSELx slave selection).
   * 
   * HREADY (Ready Signal): Indicates whether the slave is ready to complete the current transfer.
   * When HREADY is low, the transfer extends into additional clock cycles (wait states).
   * This enables slaves with different response times to work on the same bus.
   */
  role: string;
  /** 
   * Whether this component acts as master or slave for this signal
   * @doc Masters initiate bus operations and drive control signals. Slaves respond to
   * master requests and provide data. In AHB, a component can be master for some signals
   * and slave for others, depending on its role in each transaction.
   * 
   * Master vs Slave in AHB:
   * - Master: Drives HADDR, HWRITE, HSIZE, HTRANS, HWDATA; initiates transfers
   * - Slave: Drives HRDATA, HRESP, HREADY; responds to master requests
   * - Some components (like bridges) can be master for some signals and slave for others
   */
  direction: 'master' | 'slave';
}

/**
 * Collection of design constraints including clocks, resets, timing, and parity
 * @doc Constraints define the electrical and timing requirements for your design. They include
 * clock frequencies, reset behavior, timing relationships between signals, and parity checking
 * for data integrity. Proper constraints ensure your design will work correctly in hardware.
 */
export interface CfConstraintSet {
  /** 
   * Clock signal definitions
   * @doc Clock constraints define the timing requirements for your design. AHB uses
   * a single system clock (HCLK) where all signals are sampled on the rising edge.
   * Clock frequency determines maximum performance, while stableBetweenClock enables
   * AHB5 power-saving features.
   */
  clocks: CfClock[];
  /** 
   * Reset signal definitions
   * @doc Reset constraints ensure proper initialization. AHB typically uses active-low
   * reset (HRESETn) with synchronous deassert to prevent metastability. Reset timing
   * must be coordinated with clock edges for reliable operation.
   */
  resets: CfReset[];
  /** 
   * Timing relationship constraints
   * @doc Timing constraints define signal relationships like setup/hold times,
   * clock-to-output delays, and maximum path delays. These ensure your design
   * meets timing requirements at the target frequency.
   * 
   * AHB Timing Considerations:
   * - Setup/Hold Times: Signal stability relative to HCLK rising edge
   * - Clock-to-Output: Maximum delay from clock to signal change
   * - Path Delays: Maximum propagation delay through combinational logic
   * - Clock Domain Crossing: Timing for signals between different clock domains
   */
  timing?: any;
  /** 
   * Parity checking configuration
   * @doc Parity constraints define error detection for data integrity. AHB supports
   * various parity schemes including False (no parity), Odd_Parity_Byte_All (odd
   * parity on all bytes), and other vendor-specific options.
   * 
   * Parity Types:
   * - False: No parity checking (default for most designs)
   * - Odd_Parity_Byte_All: Odd parity bit added to each byte for error detection
   * 
   * Parity helps detect single-bit errors in data transmission, improving system
   * reliability for critical applications.
   */
  parity?: any;
}

/**
 * Clock signal definition with frequency and stability properties
 * @doc A clock signal provides the timing reference for synchronous operations in your design.
 * It defines the frequency in MHz and whether signals remain stable between clock edges.
 * The stableBetweenClock property is particularly important for AHB5 designs where
 * signals must remain valid between clock cycles for proper operation.
 */
export interface CfClock {
  /** 
   * Clock signal name. HCLK is the standard AHB system clock.
   * @doc HCLK (AHB Clock) is the primary timing reference for all AHB bus operations.
   * All AHB signals are sampled on the rising edge of HCLK, and the frequency
   * determines the maximum data transfer rate of your design.
   */
  name: 'HCLK' | string;
  /** 
   * Clock frequency in megahertz (MHz)
   * @doc The clock frequency determines how fast your design can operate. Higher
   * frequencies enable faster data transfers but require more careful timing analysis.
   */
  freqMHz: number;
  /** 
   * Whether signals remain stable between clock edges (AHB5 feature)
   * @doc When true, signals maintain their values between clock cycles, enabling
   * more efficient designs. This is a key feature of AHB5 that reduces power
   * consumption and improves timing margins.
   */
  stableBetweenClock?: boolean;
}

/**
 * Reset signal definition with active level and deassert behavior
 * @doc A reset signal initializes your design to a known state. It defines whether the
 * reset is active when the signal is low or high, and whether deassertion (removing reset)
 * happens synchronously with the clock or asynchronously. AHB typically uses active-low
 * reset with synchronous deassert for reliable operation.
 */
export interface CfReset {
  /** 
   * Reset signal name. HRESETn is the standard AHB reset signal.
   * @doc HRESETn (AHB Reset, active-low) initializes all AHB components to a known state.
   * The 'n' suffix indicates it's active-low, meaning reset occurs when the signal is 0.
   * During reset, all bus signals are driven to safe default values.
   */
  name: 'HRESETn' | string;
  /** 
   * Active level of the reset signal
   * @doc Determines when reset is active: 'low' means reset occurs when signal is 0,
   * 'high' means reset occurs when signal is 1. AHB typically uses active-low reset.
   */
  active: 'low' | 'high';
  /** 
   * Whether reset deassertion is synchronous with clock
   * @doc When true, reset is removed synchronously with the clock edge, preventing
   * metastability issues. AHB recommends synchronous deassert for reliable operation.
   */
  syncDeassert: boolean;
}

/**
 * Test waveform definition with timing sequences for each net
 * @doc A waveform plan defines how signals should change over time during testing.
 * It specifies the sequence of values for each net, with timing expressions that can
 * be absolute (like "t+10ns") or relative to clock events (like "rise(HCLK)*3").
 * This enables comprehensive testing of your design's behavior.
 */
export interface CfWaveformPlan {
  /** 
   * Waveform sequences for each net in the design
   * @doc Waveform plans define test scenarios for validating your design. They can
   * test AHB protocol compliance by simulating address phases, data phases, wait
   * states (HREADY), and error responses (HRESP). Each net gets a sequence of
   * timing and value changes to verify correct behavior.
   * 
   * AHB Testing Scenarios:
   * - Address Phase: Set HADDR, HWRITE, HSIZE, HTRANS for 1 cycle
   * - Data Phase: Drive HWDATA or monitor HRDATA for ≥1 cycles
   * - Wait States: Set HREADY low to extend data phase
   * - Error Responses: Set HRESP to simulate transfer failures
   * 
   * Each net entry specifies the netId (like "net_hclk" or "net_haddr") and
   * a sequence of timing and value changes to test that specific signal.
   */
  nets: { netId: string; sequence: WaveStep[] }[];
}

/**
 * Individual step in a waveform sequence with timing and value
 * @doc A waveform step defines when a signal should change and what value it should take.
 * The timing can be absolute (like "t+10ns") or relative to clock events (like "rise(HCLK)*3").
 * Values can be logic levels (0, 1, X for unknown, Z for high-impedance) or specific
 * data values for multi-bit signals.
 */
export interface WaveStep {
  /** 
   * Timing specification for this step
   * @doc Timing can be absolute (like "t+10ns") or relative to clock events (like "rise(HCLK)*3").
   * AHB timing is relative to HCLK edges: "rise(HCLK)" means at the rising edge, "rise(HCLK)*2"
   * means two clock cycles later. This enables testing of address phases (1 cycle) and data phases
   * (≥1 cycle) with proper timing relationships.
   * 
   * Address Phase: The first clock cycle of an AHB transfer where the master drives HADDR,
   * HWRITE, HSIZE, and HTRANS signals. The slave uses these signals to prepare for the
   * data transfer that follows.
   * 
   * Data Phase: One or more clock cycles after the address phase where actual data is
   * transferred. The number of cycles depends on HREADY and can include wait states.
   */
  at: string; // e.g. 't+10ns' or 'rise(HCLK)*3'
  /** 
   * Signal value at the specified time
   * @doc Values can be logic levels (0, 1, X for unknown, Z for high-impedance) or specific
   * data values. For AHB testing, you might set HADDR to specific addresses, HWDATA to test
   * data, HTRANS to transfer types, or HREADY to simulate wait states.
   * 
   * AHB Signal Values:
   * - HTRANS: 00=IDLE, 01=BUSY, 10=NONSEQ, 11=SEQ
   * - HRESP: 00=OKAY, 01=ERROR, 10=RETRY, 11=SPLIT
   * - HSIZE: 000=8-bit, 001=16-bit, 010=32-bit, 011=64-bit, etc.
   * - HWRITE: 0=READ, 1=WRITE
   * - HREADY: 0=WAIT, 1=READY
   * - HADDR: 32-bit address values
   * - HRDATA/HWDATA: Data values (32 or 64 bits)
   */
  value: '0' | '1' | 'X' | 'Z' | number | string;
}

/**
 * Protocol compliance information for components
 * @doc Compliance information indicates which industry standard a component follows,
 * such as AMBA AHB, AXI, or APB. This helps ensure proper integration and
 * enables automatic validation of design rules and signal requirements.
 */
export interface CfCompliance {
  /** 
   * Protocol standard this component follows
   * @doc AHB (Advanced High-performance Bus) is the primary system bus for ARM-based designs,
   * supporting single-clock transfers and burst operations. AXI (Advanced eXtensible Interface)
   * offers higher performance with out-of-order transfers. APB (Advanced Peripheral Bus) is
   * for low-speed peripherals. Compliance ensures proper integration and validation.
   * 
   * AHB Protocol Details:
   * - Single rising-edge clock (HCLK) for all operations
   * - Address phase (1 cycle) followed by data phase (≥1 cycles)
   * - Wait states supported via HREADY signal
   * - Error handling via HRESP signal
   * - Burst transfers for efficient memory access
   */
  standard: 'AHB' | 'AXI' | 'None';
  /** 
   * Additional compliance notes or version information
   * @doc Notes can specify protocol versions (like "AMBA AHB v2.0"), compliance levels,
   * or any deviations from the standard that users should be aware of.
   * 
   * Common AHB Compliance Notes:
   * - "AMBA AHB v2.0 compliant" - Standard protocol compliance
   * - "AHB5 features enabled" - Latest protocol features
   * - "Custom extensions for vendor IP" - Non-standard features
   * - "Limited burst support" - Reduced functionality compliance
   * - "Tested with ARM DesignStart" - Validation information
   */
  notes?: string;
}

/**
 * Reference to design documentation
 * @doc Documentation references link your design to external specifications, datasheets,
 * or user guides. This provides context for design decisions and helps other engineers
 * understand the requirements and implementation details.
 */
export interface CfDocRef {
  /** 
   * Unique identifier for the document reference
   * @doc Document IDs help organize and reference multiple documentation sources.
   * For AHB designs, you might have IDs like "ahb_spec_v2", "component_datasheet",
   * or "integration_guide" to categorize different types of documentation.
   */
  id: string;
  /** 
   * Type of documentation
   * @doc Documentation types help organize design information: 'specification' for protocol
   * standards (like AMBA AHB specification), 'datasheet' for component details, 'user_guide'
   * for implementation guidance, and 'other' for custom documentation.
   * 
   * Key AHB Specifications:
   * - AMBA AHB Protocol Specification: Defines bus protocol, signal requirements, and timing
   * - Component Datasheets: Provide pin definitions, electrical characteristics, and timing
   * - User Guides: Implementation examples and best practices for AHB designs
   */
  type: 'datasheet' | 'specification' | 'user_guide' | 'other';
  /** 
   * URL to the document (if available online)
   * @doc URLs can link to official specifications, vendor datasheets, or internal
   * documentation. For AHB designs, this might link to ARM's AMBA specification.
   * 
   * Important AHB Resources:
   * - ARM AMBA AHB Specification: Official protocol definition and requirements
   * - Vendor IP Documentation: Component-specific implementation details
   * - Application Notes: Design examples and integration guidance
   */
  url?: string;
  /** 
   * Document content (if embedded in the design)
   * @doc Embedded content allows you to include key information directly in your design
   * file, such as protocol requirements, timing constraints, or implementation notes.
   * 
   * Common AHB Content:
   * - Protocol Requirements: Signal timing, width requirements, and compliance rules
   * - Implementation Notes: Design decisions, constraints, and special considerations
   * - Test Requirements: Validation criteria and test scenarios for AHB compliance
   * - Integration Guidelines: How to connect components and ensure proper operation
   */
  content?: string;
  /** 
   * Document version for tracking changes
   * @doc Version tracking helps ensure you're using the correct specification version
   * for your design. AHB has evolved through multiple versions with different features.
   * 
   * AHB Version Evolution:
   * - AHB v1.0: Basic protocol with essential features
   * - AHB v2.0: Enhanced features and improved performance
   * - AHB5: Latest version with stable_between_clock and other optimizations
   * - Always verify compatibility between specification and implementation versions
   */
  version?: string;
} 