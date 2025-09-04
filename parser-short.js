import { toHex, joinHex, readIntLE, errDataExpected, errUnexpectedEnd } from "./utils.js";

const usagePages = {
    0x00: "Undefined",
    0x01: "Generic Desktop Page",
    0x02: "Simulation Controls Page",
    0x03: "VR Controls Page",
    0x04: "Sport Controls Page",
    0x05: "Game Controls Page",
    0x06: "Generic Device Controls Page",
    0x07: "Keyboard/Keypad Page",
    0x08: "LED Page",
    0x09: "Button Page",
    0x0A: "Ordinal Page",
    0x0B: "Telephony Device Page",
    0x0C: "Consumer Page",
    0x0D: "Digitizers Page",
    0x0E: "Haptics Page",
    0x0F: "Physical Input Device Page",
    0x10: "Unicode Page",
    0x11: "SoC Page",
    0x12: "Eye and Head Trackers Page",
    0x14: "Auxiliary Display Page",
    0x20: "Sensors Page",
    0x40: "Medical Instrument Page",
    0x41: "Braille Display Page",
    0x59: "Lighting and Illumination Page",
    0x80: "Monitor Page",
    0x81: "Monitor Enumerated Page",
    0x82: "VESA Virtual Controls Page",
    0x84: "Power Page",
    0x85: "Battery System Page",
    0x8C: "Barcode Scanner Page",
    0x8D: "Scale Page",
    0x8E: "Magnetic Stripe Reader Page",
    0x90: "Camera Control Page",
    0x91: "Arcade Page",
    0x92: "Gaming Device Page",
    0xF1D0: "FIDO Alliance Page",
};

const collectionTypes = {
    0x00: "Physical",
    0x01: "Application",
    0x02: "Logical",
    0x03: "Report",
    0x04: "Named Array",
    0x05: "Usage Switch",
    0x06: "Usage Modifier"
};

function getUsage(usagePage, usageId) {
    if (usagePage === null) {
        return null
    }

    switch (usagePage) {
        case 0x01:
            switch (usageId) {
                case 0x00: return "Undefined";
                case 0x01: return "Pointer";
                case 0x02: return "Mouse";
                case 0x04: return "Joystick";
                case 0x05: return "Gamepad";
                case 0x06: return "Keyboard";
                case 0x07: return "Keypad";
                case 0x08: return "Multi-axis Controller";
                case 0x09: return "Tablet PC System Controls";
                case 0x0A: return "Water Cooling Device";
                case 0x0B: return "Computer Chassis Device";
                case 0x0C: return "Wireless Radio Controls";
                case 0x0D: return "Portable Device Control";
                case 0x0E: return "System Multi-Axis Controller";
                case 0x0F: return "Spatial Controller";
                case 0x10: return "Assistive Control";
                case 0x11: return "Device Dock";
                case 0x12: return "Dockable Device";
                case 0x13: return "Call State Management Control";
                case 0x30: return "X";
                case 0x31: return "Y";
                case 0x32: return "Z";
                case 0x33: return "Rx";
                case 0x34: return "Ry";
                case 0x35: return "Rz";
                case 0x36: return "Slider";
                case 0x37: return "Dial";
                case 0x38: return "Wheel";
                case 0x39: return "Hat Switch";
                case 0x3A: return "Counted Buffer";
                case 0x3B: return "Byte Count";
                case 0x3C: return "Motion Wakeup";
                case 0x3D: return "Start";
                case 0x3E: return "Select";
                case 0x40: return "Vx";
                case 0x41: return "Vy";
                case 0x42: return "Vz";
                case 0x43: return "Vbrx";
                case 0x44: return "Vbry";
                case 0x45: return "Vbrz";
                case 0x46: return "Vno";
                case 0x47: return "Feature Notification";
                case 0x48: return "Resolution Multiplier";
                case 0x49: return "Qx";
                case 0x4A: return "Qy";
                case 0x4B: return "Qz";
                case 0x4C: return "Qw";
                case 0x80: return "System Control";
                case 0x81: return "System Power Down";
                case 0x82: return "System Sleep";
                case 0x83: return "System Wake Up";
                case 0x84: return "System Context Menu";
                case 0x85: return "System Main Menu";
                case 0x86: return "System App Menu";
                case 0x87: return "System Menu Help";
                case 0x88: return "System Menu Exit";
                case 0x89: return "System Menu Select";
                case 0x8A: return "System Menu Right";
                case 0x8B: return "System Menu Left";
                case 0x8C: return "System Menu Up";
                case 0x8D: return "System Menu Down";
                case 0x8E: return "System Cold Restart";
                case 0x8F: return "System Warm Restart";
                case 0x90: return "D-pad Up";
                case 0x91: return "D-pad Down";
                case 0x92: return "D-pad Right";
                case 0x93: return "D-pad Left";
                case 0x94: return "Index Trigger";
                case 0x95: return "Palm Trigger";
                case 0x96: return "Thumbstick";
                case 0x97: return "System Function Shift";
                case 0x98: return "System Function Shift Lock";
                case 0x99: return "System Function Shift Lock Indicator";
                case 0x9A: return "System Dismiss Notification";
                case 0x9B: return "System Do Not Disturb";
                case 0xA0: return "System Dock";
                case 0xA1: return "System Undock";
                case 0xA2: return "System Setup";
                case 0xA3: return "System Break";
                case 0xA4: return "System Debugger Break";
                case 0xA5: return "Application Break";
                case 0xA6: return "Application Debugger Break";
                case 0xA7: return "System Speaker Mute";
                case 0xA8: return "System Hibernate";
                case 0xA9: return "System Microphone Mute";
                case 0xAA: return "System Accessibility Binding";
                case 0xB0: return "System Display Invert";
                case 0xB1: return "System Display Internal";
                case 0xB2: return "System Display External";
                case 0xB3: return "System Display Both";
                case 0xB4: return "System Display Dual";
                case 0xB5: return "System Display Toggle Int/Ext Mode";
                case 0xB6: return "System Display Swap Primary/Secondary";
                case 0xB7: return "System Display Toggle LCD Autoscale";
                case 0xC0: return "Sensor Zone";
                case 0xC1: return "RPM";
                case 0xC2: return "Coolant Level";
                case 0xC3: return "Coolant Critical Level";
                case 0xC4: return "Coolant Pump";
                case 0xC5: return "Chassis Enclosure";
                case 0xC6: return "Wireless Radio Button";
                case 0xC7: return "Wireless Radio LED";
                case 0xC8: return "Wireless Radio Slider Switch";
                case 0xC9: return "System Display Rotation Lock Button";
                case 0xCA: return "System Display Rotation Lock Slider Switch";
                case 0xCB: return "Control Enable";
                case 0xD0: return "Dockable Device Unique ID";
                case 0xD1: return "Dockable Device Vendor ID";
                case 0xD2: return "Dockable Device Primary Usage Page";
                case 0xD3: return "Dockable Device Primary Usage ID";
                case 0xD4: return "Dockable Device Docking State";
                case 0xD5: return "Dockable Device Display Occlusion";
                case 0xD6: return "Dockable Device Object Type";
                case 0xE0: return "Call Active LED";
                case 0xE1: return "Call Mute Toggle";
                case 0xE2: return "Call Mute LED";
                default:
                    return "Reserved"
            };
        case 0x02:
            switch (usagePage) {
                case 0x00: return "Undefined";
                case 0x01: return "Flight Simulation Device";
                case 0x02: return "Automobile Simulation Device";
                case 0x03: return "Tank Simulation Device";
                case 0x04: return "Spaceship Simulation Device";
                case 0x05: return "Submarine Simulation Device";
                case 0x06: return "Sailing Simulation Device";
                case 0x07: return "Motorcycle Simulation Device";
                case 0x08: return "Sports Simulation Device";
                case 0x09: return "Airplane Simulation Device";
                case 0x0A: return "Helicopter Simulation Device";
                case 0x0B: return "Magic Carpet Simulation Device";
                case 0x0C: return "Bicycle Simulation Device";
                case 0x20: return "Flight Control Stick";
                case 0x21: return "Flight Stick";
                case 0x22: return "Cyclic Control";
                case 0x23: return "Cyclic Trim";
                case 0x24: return "Flight Yoke";
                case 0x25: return "Track Control";
                case 0xB0: return "Aileron";
                case 0xB1: return "Aileron Trim";
                case 0xB2: return "Anti-Torque Control";
                case 0xB3: return "Autopilot Enable";
                case 0xB4: return "Chaff Release";
                case 0xB5: return "Collective Control";
                case 0xB6: return "Dive Brake";
                case 0xB7: return "Electronic Countermeasures";
                case 0xB8: return "Elevator";
                case 0xB9: return "Elevator Trim";
                case 0xBA: return "Rudder";
                case 0xBB: return "Throttle";
                case 0xBC: return "Flight Communications";
                case 0xBD: return "Flare Release";
                case 0xBE: return "Landing Gear";
                case 0xBF: return "Toe Brake";
                case 0xC0: return "Trigger";
                case 0xC1: return "Weapons Arm";
                case 0xC2: return "Weapons Select";
                case 0x61: return "";
                case 0xC3: return "Wing Flaps";
                case 0xC4: return "Accelerator";
                case 0xC5: return "Brake";
                case 0xC6: return "Clutch";
                case 0xC7: return "Shifter";
                case 0xC8: return "Steering";
                case 0xC9: return "Turret Direction";
                case 0xCA: return "Barrel Elevation";
                case 0xCB: return "Dive Plane";
                case 0xCC: return "Ballast";
                case 0xCD: return "Bicycle Crank";
                case 0xCE: return "Handle Bars";
                case 0xCF: return "Front Brake";
                case 0xD0: return "Rear Brake";
                default: return "Reserved";
            }
        case 0x03:
            switch (usagePage) {
                case 0x00: return "Undefined";
                case 0x01: return "Belt";
                case 0x02: return "Body Suit";
                case 0x03: return "Flexor";
                case 0x04: return "Glove";
                case 0x05: return "Head Tracker";
                case 0x06: return "Head Mounted Display";
                case 0x07: return "Hand Tracker";
                case 0x08: return "Oculometer";
                case 0x09: return "Vest";
                case 0x0A: return "Animatronic Device";
                case 0x20: return "Stereo Enable";
                case 0x21: return "Display Enable";
                default: return "Reserved";
            }
        case 0x04:
            switch (usagePage) {
                case 0x00: return "Undefined";
                case 0x01: return "Baseball Bat";
                case 0x02: return "Golf Club";
                case 0x03: return "Rowing Machine";
                case 0x04: return "Treadmill";
                case 0x30: return "Oar";
                case 0x31: return "Slope";
                case 0x32: return "Rate";
                case 0x33: return "Stick Speed";
                case 0x34: return "Stick Face Angle";
                case 0x35: return "Stick Heel Toe";
                case 0x36: return "Stick Follow Through";
                case 0x37: return "Stick Tempo";
                case 0x38: return "Stick Type";
                case 0x39: return "Stick Height";
                case 0x50: return "Putter";
                case 0x51: return "1 Iron";
                case 0x52: return "2 Iron";
                case 0x53: return "3 Iron";
                case 0x54: return "4 Iron";
                case 0x55: return "5 Iron";
                case 0x56: return "6 Iron";
                case 0x57: return "7 Iron";
                case 0x58: return "8 Iron";
                case 0x59: return "9 Iron";
                case 0x5A: return "10 Iron";
                case 0x5B: return "11 Iron";
                case 0x5C: return "Sand Wedge";
                case 0x5D: return "Loft Wedge";
                case 0x5E: return "Power Wedge";
                case 0x5F: return "1 Wood";
                case 0x60: return "3 Wood";
                case 0x61: return "5 Wood";
                case 0x62: return "7 Wood";
                case 0x63: return "9 Wood";
                default: return "Reserved";
            }
        case 0x05:
            switch (usagePage) {
                case 0x00: return "Undefined";
                case 0x01: return "3D Game Controller";
                case 0x02: return "Pinball Device";
                case 0x03: return "Gun Device";
                case 0x20: return "Point of View";
                case 0x21: return "Turn Right Left";
                case 0x22: return "Pitch Forward Backward";
                case 0x23: return "Roll Right Left";
                case 0x24: return "Move Right Left";
                case 0x25: return "Move Forward Backward";
                case 0x26: return "Move Up Down";
                case 0x27: return "Lean Right Left";
                case 0x28: return "Lean Forward Backward";
                case 0x29: return "Height of POV";
                case 0x2A: return "Flipper";
                case 0x2B: return "Secondary Flipper";
                case 0x2C: return "Bump";
                case 0x2D: return "New Game";
                case 0x2E: return "Shoot Ball";
                case 0x2F: return "Player";
                case 0x30: return "Gun Bolt";
                case 0x31: return "Gun Clip";
                case 0x32: return "Gun Selector";
                case 0x33: return "Gun Single Shot";
                case 0x34: return "Gun Burst";
                case 0x35: return "Gun Automatic";
                case 0x36: return "Gun Safety";
                case 0x37: return "Gamepad Fire Jump";
                case 0x39: return "Gamepad Trigger";
                case 0x3A: return "Form-fitting Gamepad";
                default: return "Reserved";
            }
        case 0x06:
            switch (usagePage) {
                case 0x00: return "Undefined";
                case 0x01: return "Background Nonuser Controls";
                case 0x20: return "Battery Strength";
                case 0x21: return "Wireless Channel";
                case 0x22: return "Wireless ID";
                case 0x23: return "Discover Wireless Control";
                case 0x24: return "Security Code Character Entered";
                case 0x25: return "Security Code Character Erased";
                case 0x26: return "Security Code Cleared";
                case 0x27: return "Sequence ID";
                case 0x28: return "Sequence ID Reset";
                case 0x29: return "RF Signal Strength";
                case 0x2A: return "Software Version";
                case 0x2B: return "Protocol Version";
                case 0x2C: return "Hardware Version";
                case 0x2D: return "Major";
                case 0x2E: return "Minor";
                case 0x2F: return "Revision";
                case 0x30: return "Handedness";
                case 0x31: return "Either Hand";
                case 0x32: return "Left Hand";
                case 0x33: return "Right Hand";
                case 0x34: return "Both Hands";
                case 0x40: return "Grip Pose Offset";
                case 0x41: return "Pointer Pose Offset";
                default: return "Reserved";
            }
        case 0x07:
            switch (usagePage) {
                case 0x01: return "Keyboard ErrorRollOver";
                case 0x02: return "Keyboard POSTFail";
                case 0x03: return "Keyboard ErrorUndefined";
                case 0x04: return "Keyboard a and A";
                case 0x05: return "Keyboard b and B";
                case 0x06: return "Keyboard c and C";
                case 0x07: return "Keyboard d and D";
                case 0x08: return "Keyboard e and E";
                case 0x09: return "Keyboard f and F";
                case 0x0A: return "Keyboard g and G";
                case 0x0B: return "Keyboard h and H";
                case 0x0C: return "Keyboard i and I";
                case 0x0D: return "Keyboard j and J";
                case 0x0E: return "Keyboard k and K";
                case 0x0F: return "Keyboard l and L";
                case 0x10: return "Keyboard m and M";
                case 0x11: return "Keyboard n and N";
                case 0x12: return "Keyboard o and O";
                case 0x13: return "Keyboard p and P";
                case 0x14: return "Keyboard q and Q";
                case 0x15: return "Keyboard r and R";
                case 0x16: return "Keyboard s and S";
                case 0x17: return "Keyboard t and T";
                case 0x18: return "Keyboard u and U";
                case 0x19: return "Keyboard v and V";
                case 0x1A: return "Keyboard w and W2";
                case 0x1B: return "Keyboard x and X";
                case 0x1C: return "Keyboard y and Y";
                case 0x1D: return "Keyboard z and Z";
                case 0x1E: return "Keyboard 1 and !";
                case 0x1F: return "Keyboard 2 and @";
                case 0x20: return "Keyboard 3 and #";
                case 0x21: return "Keyboard 4 and $";
                case 0x22: return "Keyboard 5 and %";
                case 0x23: return "Keyboard 6 and ∧";
                case 0x24: return "Keyboard 7 and &";
                case 0x25: return "Keyboard 8 and *";
                case 0x26: return "Keyboard 9 and (";
                case 0x27: return "Keyboard 0 and )";
                case 0x28: return "Keyboard Return (ENTER)3";
                case 0x29: return "Keyboard ESCAPE";
                case 0x2A: return "Keyboard DELETE (Backspace)4";
                case 0x2B: return "Keyboard Tab";
                case 0x2C: return "Keyboard Spacebar";
                case 0x2D: return "Keyboard - and _";
                case 0x2E: return "Keyboard = and +";
                case 0x2F: return "Keyboard [ and {";
                case 0x30: return "Keyboard ] and }";
                case 0x31: return "Keyboard \\ and |";
                case 0x32: return "Keyboard Non-US # and ˜";
                case 0x33: return "Keyboard ; and :";
                case 0x34: return "Keyboard ' and \"";
                case 0x35: return "Keyboard Grave Accent and Tilde2";
                case 0x36: return "Keyboard , and <";
                case 0x37: return "Keyboard . and >";
                case 0x38: return "Keyboard and ?";
                case 0x39: return "Keyboard Caps Lock6";
                case 0x3A: return "Keyboard F1";
                case 0x3B: return "Keyboard F2";
                case 0x3C: return "Keyboard F3";
                case 0x3D: return "Keyboard F4";
                case 0x3E: return "Keyboard F5";
                case 0x3F: return "Keyboard F6";
                case 0x40: return "Keyboard F7";
                case 0x41: return "Keyboard F8";
                case 0x42: return "Keyboard F9";
                case 0x43: return "Keyboard F10";
                case 0x44: return "Keyboard F11";
                case 0x45: return "Keyboard F12";
                case 0x46: return "Keyboard PrintScreen";
                case 0x47: return "Keyboard Scroll Lock";
                case 0x48: return "Keyboard Pause";
                case 0x49: return "Keyboard Insert";
                case 0x4A: return "Keyboard Home";
                case 0x4B: return "Keyboard PageUp";
                case 0x4C: return "Keyboard Delete Forward,8";
                case 0x4D: return "Keyboard End";
                case 0x4E: return "Keyboard PageDown";
                case 0x4F: return "Keyboard RightArrow";
                case 0x50: return "Keyboard LeftArrow";
                case 0x51: return "Keyboard DownArrow";
                case 0x52: return "Keyboard UpArrow";
                case 0x53: return "Keypad Num Lock and Clear";
                case 0x54: return "Keypad";
                case 0x55: return "Keypad *";
                case 0x56: return "Keypad -";
                case 0x57: return "Keypad +";
                case 0x58: return "Keypad ENTER";
                case 0x59: return "Keypad 1 and End";
                case 0x5A: return "Keypad 2 and Down Arrow";
                case 0x5B: return "Keypad 3 and PageDn";
                case 0x5C: return "Keypad 4 and Left Arrow";
                case 0x5D: return "Keypad 5";
                case 0x5E: return "Keypad 6 and Right Arrow";
                case 0x5F: return "Keypad 7 and Home";
                case 0x60: return "Keypad 8 and Up Arrow";
                case 0x61: return "Keypad 9 and PageUp";
                case 0x62: return "Keypad 0 and Insert";
                case 0x63: return "Keypad . and Delete";
                case 0x64: return "Keyboard Non-US \and |";
                case 0x65: return "Keyboard Application";
                case 0x66: return "Keyboard Power";
                case 0x67: return "Keypad =";
                case 0x68: return "Keyboard F13";
                case 0x69: return "Keyboard F14";
                case 0x6A: return "Keyboard F15";
                case 0x6B: return "Keyboard F16";
                case 0x6C: return "Keyboard F17";
                case 0x6D: return "Keyboard F18";
                case 0x6E: return "Keyboard F19";
                case 0x6F: return "Keyboard F20";
                case 0x70: return "Keyboard F21";
                case 0x71: return "Keyboard F22";
                case 0x72: return "Keyboard F23";
                case 0x73: return "Keyboard F24";
                case 0x74: return "Keyboard Execute";
                case 0x75: return "Keyboard Help";
                case 0x76: return "Keyboard Menu";
                case 0x77: return "Keyboard Select";
                case 0x78: return "Keyboard Stop";
                case 0x79: return "Keyboard Again";
                case 0x7A: return "Keyboard Undo";
                case 0x7B: return "Keyboard Cut";
                case 0x7C: return "Keyboard Copy";
                case 0x7D: return "Keyboard Paste";
                case 0x7E: return "Keyboard Find";
                case 0x7F: return "Keyboard Mute";
                case 0x80: return "Keyboard Volume Up";
                case 0x81: return "Keyboard Volume Down";
                case 0x82: return "Keyboard Locking Caps Lock";
                case 0x83: return "Keyboard Locking Num Lock";
                case 0x84: return "Keyboard Locking Scroll Lock";
                case 0x85: return "Keypad Comma";
                case 0x86: return "Keypad Equal Sign";
                case 0x87: return "Keyboard International1";
                case 0x88: return "Keyboard International2";
                case 0x89: return "Keyboard International3";
                case 0x8A: return "Keyboard International4";
                case 0x8B: return "Keyboard International5";
                case 0x8C: return "Keyboard International6";
                case 0x8D: return "Keyboard International7";
                case 0x8E: return "Keyboard International8";
                case 0x8F: return "Keyboard International9";
                case 0x90: return "Keyboard LANG1";
                case 0x91: return "Keyboard LANG2";
                case 0x92: return "Keyboard LANG3";
                case 0x93: return "Keyboard LANG4";
                case 0x94: return "Keyboard LANG5";
                case 0x95: return "Keyboard LANG6";
                case 0x96: return "Keyboard LANG7";
                case 0x97: return "Keyboard LANG8";
                case 0x98: return "Keyboard LANG9";
                case 0x99: return "Keyboard Alternate Erase";
                case 0x9A: return "Keyboard SysReq Attention";
                case 0x9B: return "Keyboard Cancel";
                case 0x9C: return "Keyboard Clear";
                case 0x9D: return "Keyboard Prior";
                case 0x9E: return "Keyboard Return";
                case 0x9F: return "Keyboard Separator";
                case 0xA0: return "Keyboard Out";
                case 0xA1: return "Keyboard Oper";
                case 0xA2: return "Keyboard Clear Again";
                case 0xA3: return "Keyboard CrSel Props";
                case 0xA4: return "Keyboard ExSel";
                case 0xB0: return "Keypad 00";
                case 0xB1: return "Keypad 000";
                case 0xB2: return "Thousands Separator";
                case 0xB3: return "Decimal Separator";
                case 0xB4: return "Currency Unit";
                case 0xB5: return "Currency Sub-unit";
                case 0xB6: return "Keypad (";
                case 0xB7: return "Keypad )";
                case 0xB8: return "Keypad {";
                case 0xB9: return "Keypad }";
                case 0xBA: return "Keypad Tab";
                case 0xBB: return "Keypad Backspace";
                case 0xBC: return "Keypad A";
                case 0xBD: return "Keypad B";
                case 0xBE: return "Keypad C";
                case 0xBF: return "Keypad D";
                case 0xC0: return "Keypad E";
                case 0xC1: return "Keypad F";
                case 0xC2: return "Keypad XOR";
                case 0xC3: return "Keypad ∧";
                case 0xC4: return "Keypad %";
                case 0xC5: return "Keypad <";
                case 0xC6: return "Keypad >";
                case 0xC7: return "Keypad &";
                case 0xC8: return "Keypad &&";
                case 0xC9: return "Keypad |";
                case 0xCA: return "Keypad ||";
                case 0xCB: return "Keypad :";
                case 0xCC: return "Keypad #";
                case 0xCD: return "Keypad Space";
                case 0xCE: return "Keypad @";
                case 0xCF: return "Keypad !";
                case 0xD0: return "Keypad Memory Store";
                case 0xD1: return "Keypad Memory Recall";
                case 0xD2: return "Keypad Memory Clear";
                case 0xD3: return "Keypad Memory Add";
                case 0xD4: return "Keypad Memory Subtract";
                case 0xD5: return "Keypad Memory Multiply";
                case 0xD6: return "Keypad Memory Divide";
                case 0xD7: return "Keypad + -";
                case 0xD8: return "Keypad Clear";
                case 0xD9: return "Keypad Clear Entry";
                case 0xDA: return "Keypad Binary";
                case 0xDB: return "Keypad Octal";
                case 0xDC: return "Keypad Decimal";
                case 0xDD: return "Keypad Hexadecimal";
                case 0xE0: return "Keyboard LeftControl";
                case 0xE1: return "Keyboard LeftShift";
                case 0xE2: return "Keyboard LeftAlt";
                case 0xE3: return "Keyboard Left GUI";
                case 0xE4: return "Keyboard RightControl";
                case 0xE5: return "Keyboard RightShift";
                case 0xE6: return "Keyboard RightAlt";
                case 0xE7: return "Keyboard Right GUI";
                default: return "Reserved";
            }
        case 0x08:
            switch (usagePage) {
                case 0x00: return "Undefined";
                case 0x01: return "Num Lock";
                case 0x02: return "Caps Lock";
                case 0x03: return "Scroll Lock";
                case 0x04: return "Compose";
                case 0x05: return "Kana";
                case 0x06: return "Power";
                case 0x07: return "Shift";
                case 0x08: return "Do Not Disturb";
                case 0x09: return "Mute";
                case 0x0A: return "Tone Enable";
                case 0x0B: return "High Cut Filter";
                case 0x0C: return "Low Cut Filter";
                case 0x0D: return "Equalizer Enable";
                case 0x0E: return "Sound Field On";
                case 0x0F: return "Surround On";
                case 0x10: return "Repeat";
                case 0x11: return "Stereo";
                case 0x12: return "Sampling Rate Detect";
                case 0x13: return "Spinning";
                case 0x14: return "CAV";
                case 0x15: return "CLV";
                case 0x16: return "Recording Format Detect";
                case 0x17: return "Off-Hook";
                case 0x18: return "Ring";
                case 0x19: return "Message Waiting";
                case 0x1A: return "Data Mode";
                case 0x1B: return "Battery Operation";
                case 0x1C: return "Battery OK";
                case 0x1D: return "Battery Low";
                case 0x1E: return "Speaker";
                case 0x1F: return "Headset";
                case 0x20: return "Hold";
                case 0x21: return "Microphone";
                case 0x22: return "Coverage";
                case 0x23: return "Night Mode";
                case 0x24: return "Send Calls";
                case 0x25: return "Call Pickup";
                case 0x26: return "Conference";
                case 0x27: return "Stand-by";
                case 0x28: return "Camera On";
                case 0x29: return "Camera Off";
                case 0x2A: return "On-Line";
                case 0x2B: return "Off-Line";
                case 0x2C: return "Busy";
                case 0x2D: return "Ready";
                case 0x2E: return "Paper-Out";
                case 0x2F: return "Paper-Jam";
                case 0x30: return "Remote";
                case 0x31: return "Forward";
                case 0x32: return "Reverse";
                case 0x33: return "Stop";
                case 0x34: return "Rewind";
                case 0x35: return "Fast Forward";
                case 0x36: return "Play";
                case 0x37: return "Pause";
                case 0x38: return "Record";
                case 0x39: return "Error";
                case 0x3A: return "Usage Selected Indicator";
                case 0x3B: return "Usage In Use Indicator";
                case 0x3C: return "Usage Multi Mode Indicator";
                case 0x3D: return "Indicator On";
                case 0x3E: return "Indicator Flash";
                case 0x3F: return "Indicator Slow Blink";
                case 0x40: return "Indicator Fast Blink";
                case 0x41: return "Indicator Off";
                case 0x42: return "Flash On Time";
                case 0x43: return "Slow Blink On Time";
                case 0x44: return "Slow Blink Off Time";
                case 0x45: return "Fast Blink On Time";
                case 0x46: return "Fast Blink Off Time";
                case 0x47: return "Usage Indicator Color";
                case 0x48: return "Indicator Red";
                case 0x49: return "Indicator Green";
                case 0x4A: return "Indicator Amber";
                case 0x4B: return "Generic Indicator";
                case 0x4C: return "System Suspend";
                case 0x4D: return "External Power Connected";
                case 0x4E: return "Indicator Blue";
                case 0x4F: return "Indicator Orange";
                case 0x50: return "Good Status";
                case 0x51: return "Warning Status";
                case 0x52: return "RGB LED";
                case 0x53: return "Red LED Channel";
                case 0x54: return "Blue LED Channel";
                case 0x55: return "Green LED Channel";
                case 0x56: return "LED Intensity";
                case 0x57: return "System Microphone Mute";
                case 0x60: return "Player Indicator";
                case 0x61: return "Player 1";
                case 0x62: return "Player 2";
                case 0x63: return "Player 3";
                case 0x64: return "Player 4";
                case 0x65: return "Player 5";
                case 0x66: return "Player 6";
                case 0x67: return "Player 7";
                case 0x68: return "Player 8";
                default: return "Reserved";
            }
        case 0x09:
            switch (usagePage) {
                case 0x00: return "No Button Pressed";
                case 0x01: return "Button 1 (primary trigger)";
                case 0x02: return "Button 2 (secondary)";
                case 0x03: return "Button 3 (tertiary)";
                case 0x04: return "Button 4 See Note";
                default: return `Button ${usagePage}`;
            }
        case 0x0A:
            switch (usagePage) {
                case 0x01: return "Instance 1";
                case 0x02: return "Instance 2";
                case 0x03: return "Instance 3";
                case 0x04: return "Instance 4";
                default: return `Instance ${usagePage}`;
            }
        case 0x0B:
            switch (usagePage) {
                case 0x00: return "Undefined";
                case 0x01: return "Phone";
                case 0x02: return "Answering Machine";
                case 0x03: return "Message Controls";
                case 0x04: return "Handset";
                case 0x05: return "Headset";
                case 0x06: return "Telephony Key Pad";
                case 0x07: return "Programmable Button";
                case 0x20: return "Hook Switch";
                case 0x21: return "Flash";
                case 0x22: return "Feature";
                case 0x23: return "Hold";
                case 0x24: return "Redial";
                case 0x25: return "Transfer";
                case 0x26: return "Drop";
                case 0x27: return "Park";
                case 0x28: return "Forward Calls";
                case 0x29: return "Alternate Function";
                case 0x2A: return "Line";
                case 0x2B: return "Speaker Phone";
                case 0x2C: return "Conference";
                case 0x2D: return "Ring Enable";
                case 0x2E: return "Ring Select";
                case 0x2F: return "Phone Mute";
                case 0x30: return "Caller ID";
                case 0x31: return "Send";
                case 0x50: return "Speed Dial";
                case 0x51: return "Store Number";
                case 0x52: return "Recall Number";
                case 0x53: return "Phone Directory";
                case 0x70: return "Voice Mail";
                case 0x71: return "Screen Calls";
                case 0x72: return "Do Not Disturb";
                case 0x73: return "Message";
                case 0x74: return "Answer On Off";
                case 0x90: return "Inside Dial Tone";
                case 0x91: return "Outside Dial Tone";
                case 0x92: return "Inside Ring Tone";
                case 0x93: return "Outside Ring Tone";
                case 0x94: return "Priority Ring Tone";
                case 0x95: return "Inside Ringback";
                case 0x96: return "Priority Ringback";
                case 0x97: return "Line Busy Tone";
                case 0x98: return "Reorder Tone";
                case 0x99: return "Call Waiting Tone";
                case 0x9A: return "Confirmation Tone 1";
                case 0x9B: return "Confirmation Tone 2";
                case 0x9C: return "Tones Off";
                case 0x9D: return "Outside Ringback";
                case 0x9E: return "Ringer";
                case 0xB0: return "Phone Key 0";
                case 0xB1: return "Phone Key 1";
                case 0xB2: return "Phone Key 2";
                case 0xB3: return "Phone Key 3";
                case 0xB4: return "Phone Key 4";
                case 0xB5: return "Phone Key 5";
                case 0xB6: return "Phone Key 6";
                case 0xB7: return "Phone Key 7";
                case 0xB8: return "Phone Key 8";
                case 0xB9: return "Phone Key 9";
                case 0xBA: return "Phone Key Star";
                case 0xBB: return "Phone Key Pound";
                case 0xBC: return "Phone Key A";
                case 0xBD: return "Phone Key B";
                case 0xBE: return "Phone Key C";
                case 0xBF: return "Phone Key D";
                case 0xC0: return "Phone Call History Key";
                case 0xC1: return "Phone Caller ID Key";
                case 0xC2: return "Phone Settings Key";
                case 0xF0: return "Host Control";
                case 0xF1: return "Host Available";
                case 0xF2: return "Host Call Active";
                case 0xF3: return "Activate Handset Audio";
                case 0xF4: return "Ring Type";
                case 0xF5: return "Re-dialable Phone Number";
                case 0xF8: return "Stop Ring Tone";
                case 0xF9: return "PSTN Ring Tone";
                case 0xFA: return "Host Ring Tone";
                case 0xFB: return "Alert Sound Error";
                case 0xFC: return "Alert Sound Confirm";
                case 0xFD: return "Alert Sound Notification";
                case 0xFE: return "Silent Ring";
                case 0x108: return "Email Message Waiting";
                case 0x109: return "Voicemail Message Waiting";
                case 0x10A: return "Host Hold";
                case 0x110: return "Incoming Call History Count";
                case 0x111: return "Outgoing Call History Count";
                case 0x112: return "Incoming Call History";
                case 0x113: return "Outgoing Call History";
                case 0x114: return "Phone Locale";
                case 0x140: return "Phone Time Second";
                case 0x141: return "Phone Time Minute";
                case 0x142: return "Phone Time Hour";
                case 0x143: return "Phone Date Day";
                case 0x144: return "Phone Date Month";
                case 0x145: return "Phone Date Year";
                case 0x146: return "Handset Nickname";
                case 0x147: return "Address Book ID";
                case 0x14A: return "Call Duration";
                case 0x14B: return "Dual Mode Phone";
                default: return "Reserved";
            }
        case 0x0C:
            switch (usagePage) {
                case 0x00: return "Undefined";
                case 0x01: return "Consumer Control";
                case 0x02: return "Numeric Key Pad";
                case 0x03: return "Programmable Buttons";
                case 0x04: return "Microphone";
                case 0x05: return "Headphone";
                case 0x06: return "Graphic Equalizer";
                case 0x20: return "+10";
                case 0x21: return "+100";
                case 0x22: return "AM PM";
                case 0x30: return "Power";
                case 0x31: return "Reset";
                case 0x32: return "Sleep";
                case 0x33: return "Sleep After";
                case 0x34: return "Sleep Mode";
                case 0x35: return "Illumination";
                case 0x36: return "Function Buttons";
                case 0x40: return "Menu";
                case 0x41: return "Menu Pick";
                case 0x42: return "Menu Up";
                case 0x43: return "Menu Down";
                case 0x44: return "Menu Left";
                case 0x45: return "Menu Right";
                case 0x46: return "Menu Escape";
                case 0x47: return "Menu Value Increase";
                case 0x48: return "Menu Value Decrease";
                case 0x60: return "Data On Screen";
                case 0x61: return "Closed Caption";
                case 0x62: return "Closed Caption Select";
                case 0x63: return "VCR TV";
                case 0x64: return "Broadcast Mode";
                case 0x65: return "Snapshot";
                case 0x66: return "Still";
                case 0x67: return "Picture-in-Picture Toggle";
                case 0x68: return "Picture-in-Picture Swap";
                case 0x69: return "Red Menu Button";
                case 0x6A: return "Green Menu Button";
                case 0x6B: return "Blue Menu Button";
                case 0x6C: return "Yellow Menu Button";
                case 0x6D: return "Aspect";
                case 0x6E: return "3D Mode Select";
                case 0x6F: return "Display Brightness Increment";
                case 0x70: return "Display Brightness Decrement";
                case 0x71: return "Display Brightness";
                case 0x72: return "Display Backlight Toggle";
                case 0x73: return "Display Set Brightness to Minimum";
                case 0x74: return "Display Set Brightness to Maximum";
                case 0x75: return "Display Set Auto Brightness";
                case 0x76: return "Camera Access Enabled";
                case 0x77: return "Camera Access Disabled";
                case 0x78: return "Camera Access Toggle";
                case 0x79: return "Keyboard Brightness Increment";
                case 0x7A: return "Keyboard Brightness Decrement";
                case 0x7B: return "Keyboard Backlight Set Level";
                case 0x7C: return "Keyboard Backlight";
                case 0x7D: return "Keyboard Backlight Set Minimum";
                case 0x7E: return "Keyboard Backlight Set Maximum";
                case 0x7F: return "Keyboard Backlight Auto";
                case 0x80: return "Selection";
                case 0x81: return "Assign Selection";
                case 0x82: return "Mode Step";
                case 0x83: return "Recall Last";
                case 0x84: return "Enter Channel";
                case 0x85: return "Order Movie";
                case 0x86: return "Channel";
                case 0x87: return "Media Selection";
                case 0x88: return "Media Select Computer";
                case 0x89: return "Media Select TV";
                case 0x8A: return "Media Select WWW";
                case 0x8B: return "Media Select DVD";
                case 0x8C: return "Media Select Telephone";
                case 0x8D: return "Media Select Program Guide";
                case 0x8E: return "Media Select Video Phone";
                case 0x8F: return "Media Select Games";
                case 0x90: return "Media Select Messages";
                case 0x91: return "Media Select CD";
                case 0x92: return "Media Select VCR";
                case 0x93: return "Media Select Tuner";
                case 0x94: return "Quit";
                case 0x95: return "Help";
                case 0x96: return "Media Select Tape";
                case 0x97: return "Media Select Cable";
                case 0x98: return "Media Select Satellite";
                case 0x99: return "Media Select Security";
                case 0x9A: return "Media Select Home";
                case 0x9B: return "Media Select Call";
                case 0x9C: return "Channel Increment";
                case 0x9D: return "Channel Decrement";
                case 0x9E: return "Media Select SAP";
                case 0xA0: return "VCR Plus";
                case 0xA1: return "Once";
                case 0xA2: return "Daily";
                case 0xA3: return "Weekly";
                case 0xA4: return "Monthly";
                case 0xB0: return "Play";
                case 0xB1: return "Pause";
                case 0xB2: return "Record";
                case 0xB3: return "Fast Forward";
                case 0xB4: return "Rewind";
                case 0xB5: return "Scan Next Track";
                case 0xB6: return "Scan Previous Track";
                case 0xB7: return "Stop";
                case 0xB8: return "Eject";
                case 0xB9: return "Random Play";
                case 0xBA: return "Select Disc";
                case 0xBB: return "Enter Disc";
                case 0xBC: return "Repeat";
                case 0xBD: return "Tracking";
                case 0xBE: return "Track Normal";
                case 0xBF: return "Slow Tracking";
                case 0xC0: return "Frame Forward";
                case 0xC1: return "Frame Back";
                case 0xC2: return "Mark";
                case 0xC3: return "Clear Mark";
                case 0xC4: return "Repeat From Mark";
                case 0xC5: return "Return To Mark";
                case 0xC6: return "Search Mark Forward";
                case 0xC7: return "Search Mark Backwards";
                case 0xC8: return "Counter Reset";
                case 0xC9: return "Show Counter";
                case 0xCA: return "Tracking Increment";
                case 0xCB: return "Tracking Decrement";
                case 0xCC: return "Stop Eject";
                case 0xCD: return "Play Pause";
                case 0xCE: return "Play Skip";
                case 0xCF: return "Voice Command";
                case 0xD0: return "Invoke Capture Interface";
                case 0xD1: return "Start or Stop Game Recording";
                case 0xD2: return "Historical Game Capture";
                case 0xD3: return "Capture Game Screenshot";
                case 0xD4: return "Show or Hide Recording Indicator";
                case 0xD5: return "Start or Stop Microphone Capture";
                case 0xD6: return "Start or Stop Camera Capture";
                case 0xD7: return "Start or Stop Game Broadcast";
                case 0xD8: return "Start or Stop Voice Dictation Session";
                case 0xD9: return "Invoke Dismiss Emoji Picker";
                case 0xE0: return "Volume";
                case 0xE1: return "Balance";
                case 0xE2: return "Mute";
                case 0xE3: return "Bass";
                case 0xE4: return "Treble";
                case 0xE5: return "Bass Boost";
                case 0xE6: return "Surround Mode";
                case 0xE7: return "Loudness";
                case 0xE8: return "MPX";
                case 0xE9: return "Volume Increment";
                case 0xEA: return "Volume Decrement";
                case 0xF0: return "Speed Select";
                case 0xF1: return "Playback Speed";
                case 0xF2: return "Standard Play";
                case 0xF3: return "Long Play";
                case 0xF4: return "Extended Play";
                case 0xF5: return "Slow";
                case 0x100: return "Fan Enable";
                case 0x101: return "Fan Speed";
                case 0x102: return "Light Enable";
                case 0x103: return "Light Illumination Level";
                case 0x104: return "Climate Control Enable";
                case 0x105: return "Room Temperature";
                case 0x106: return "Security Enable";
                case 0x107: return "Fire Alarm";
                case 0x108: return "Police Alarm";
                case 0x109: return "Proximity";
                case 0x10A: return "Motion";
                case 0x10B: return "Duress Alarm";
                case 0x10C: return "Holdup Alarm";
                case 0x10D: return "Medical Alarm";
                case 0x150: return "Balance Right";
                case 0x151: return "Balance Left";
                case 0x152: return "Bass Increment";
                case 0x153: return "Bass Decrement";
                case 0x154: return "Treble Increment";
                case 0x155: return "Treble Decrement";
                case 0x160: return "Speaker System";
                case 0x161: return "Channel Left";
                case 0x162: return "Channel Right";
                case 0x163: return "Channel Center";
                case 0x164: return "Channel Front";
                case 0x165: return "Channel Center Front";
                case 0x166: return "Channel Side";
                case 0x167: return "Channel Surround";
                case 0x168: return "Channel Low Frequency Enhancement";
                case 0x169: return "Channel Top";
                case 0x16A: return "Channel Unknown";
                case 0x170: return "Sub-channel";
                case 0x171: return "Sub-channel Increment";
                case 0x172: return "Sub-channel Decrement";
                case 0x173: return "Alternate Audio Increment";
                case 0x174: return "Alternate Audio Decrement";
                case 0x180: return "Application Launch Buttons";
                case 0x181: return "AL Launch Button Configuration Tool";
                case 0x182: return "AL Programmable Button Configuration";
                case 0x183: return "AL Consumer Control Configuration";
                case 0x184: return "AL Word Processor";
                case 0x185: return "AL Text Editor";
                case 0x186: return "AL Spreadsheet";
                case 0x187: return "AL Graphics Editor";
                case 0x188: return "AL Presentation App";
                case 0x189: return "AL Database App";
                case 0x18A: return "AL Email Reader";
                case 0x18B: return "AL Newsreader";
                case 0x18C: return "AL Voicemail";
                case 0x18D: return "AL Contacts Address Book";
                case 0x18E: return "AL Calendar Schedule";
                case 0x18F: return "AL Task Project Manager";
                case 0x190: return "AL Log Journal Timecard";
                case 0x191: return "AL Checkbook Finance";
                case 0x192: return "AL Calculator";
                case 0x193: return "AL A V Capture Playback";
                case 0x194: return "AL Local Machine Browser";
                case 0x195: return "AL LAN WAN Browser";
                case 0x196: return "AL Internet Browser";
                case 0x197: return "AL Remote Networking ISP Connect";
                case 0x198: return "AL Network Conference";
                case 0x199: return "AL Network Chat";
                case 0x19A: return "AL Telephony Dialer";
                case 0x19B: return "AL Logon";
                case 0x19C: return "AL Logoff";
                case 0x19D: return "AL Logon Logoff";
                case 0x19E: return "AL Terminal Lock Screensaver";
                case 0x19F: return "AL Control Panel";
                case 0x1A0: return "AL Command Line Processor Run";
                case 0x1A1: return "AL Process Task Manager";
                case 0x1A2: return "AL Select Task Application";
                case 0x1A3: return "AL Next Task Application";
                case 0x1A4: return "AL Previous Task Application";
                case 0x1A5: return "AL Preemptive Halt Task Application";
                case 0x1A6: return "AL Integrated Help Center";
                case 0x1A7: return "AL Documents";
                case 0x1A8: return "AL Thesaurus";
                case 0x1A9: return "AL Dictionary";
                case 0x1AA: return "AL Desktop";
                case 0x1AB: return "AL Spell Check";
                case 0x1AC: return "AL Grammar Check";
                case 0x1AD: return "AL Wireless Status";
                case 0x1AE: return "AL Keyboard Layout";
                case 0x1AF: return "AL Virus Protection";
                case 0x1B0: return "AL Encryption";
                case 0x1B1: return "AL Screen Saver";
                case 0x1B2: return "AL Alarms";
                case 0x1B3: return "AL Clock";
                case 0x1B4: return "AL File Browser";
                case 0x1B5: return "AL Power Status";
                case 0x1B6: return "AL Image Browser";
                case 0x1B7: return "AL Audio Browser";
                case 0x1B8: return "AL Movie Browser";
                case 0x1B9: return "AL Digital Rights Manager";
                case 0x1BA: return "AL Digital Wallet";
                case 0x1BC: return "AL Instant Messaging";
                case 0x1BD: return "AL OEM Features Tips Tutorial Browser";
                case 0x1BE: return "AL OEM Help";
                case 0x1BF: return "AL Online Community";
                case 0x1C0: return "AL Entertainment Content Browser";
                case 0x1C1: return "AL Online Shopping Browser";
                case 0x1C2: return "AL SmartCard Information Help";
                case 0x1C3: return "AL Market Monitor Finance Browser";
                case 0x1C4: return "AL Customized Corporate News Browser";
                case 0x1C5: return "AL Online Activity Browser";
                case 0x1C6: return "AL Research Search Browser";
                case 0x1C7: return "AL Audio Player";
                case 0x1C8: return "AL Message Status";
                case 0x1C9: return "AL Contact Sync";
                case 0x1CA: return "AL Navigation";
                case 0x1CB: return "AL Context-aware Desktop Assistant";
                case 0x200: return "Generic GUI Application Controls";
                case 0x201: return "AC New";
                case 0x202: return "AC Open";
                case 0x203: return "AC Close";
                case 0x204: return "AC Exit";
                case 0x205: return "AC Maximize";
                case 0x206: return "AC Minimize";
                case 0x207: return "AC Save";
                case 0x208: return "AC Print";
                case 0x209: return "AC Properties";
                case 0x21A: return "AC Undo";
                case 0x21B: return "AC Copy";
                case 0x21C: return "AC Cut";
                case 0x21D: return "AC Paste";
                case 0x21E: return "AC Select All";
                case 0x21F: return "AC Find";
                case 0x220: return "AC Find and Replace";
                case 0x221: return "AC Search";
                case 0x222: return "AC Go To";
                case 0x223: return "AC Home";
                case 0x224: return "AC Back";
                case 0x225: return "AC Forward";
                case 0x226: return "AC Stop";
                case 0x227: return "AC Refresh";
                case 0x228: return "AC Previous Link";
                case 0x229: return "AC Next Link";
                case 0x22A: return "AC Bookmarks";
                case 0x22B: return "AC History";
                case 0x22C: return "AC Subscriptions";
                case 0x22D: return "AC Zoom In";
                case 0x22E: return "AC Zoom Out";
                case 0x22F: return "AC Zoom";
                case 0x230: return "AC Full Screen View";
                case 0x231: return "AC Normal View";
                case 0x232: return "AC View Toggle";
                case 0x233: return "AC Scroll Up";
                case 0x234: return "AC Scroll Down";
                case 0x235: return "AC Scroll";
                case 0x236: return "AC Pan Left";
                case 0x237: return "AC Pan Right";
                case 0x238: return "AC Pan";
                case 0x239: return "AC New Window";
                case 0x23A: return "AC Tile Horizontally";
                case 0x23B: return "AC Tile Vertically";
                case 0x23C: return "AC Format";
                case 0x23D: return "AC Edit";
                case 0x23E: return "AC Bold";
                case 0x23F: return "AC Italics";
                case 0x240: return "AC Underline";
                case 0x241: return "AC Strikethrough";
                case 0x242: return "AC Subscript";
                case 0x243: return "AC Superscript";
                case 0x244: return "AC All Caps";
                case 0x245: return "AC Rotate";
                case 0x246: return "AC Resize";
                case 0x247: return "AC Flip Horizontal";
                case 0x248: return "AC Flip Vertical";
                case 0x249: return "AC Mirror Horizontal";
                case 0x24A: return "AC Mirror Vertical";
                case 0x24B: return "AC Font Select";
                case 0x24C: return "AC Font Color";
                case 0x24D: return "AC Font Size";
                case 0x24E: return "AC Justify Left";
                case 0x24F: return "AC Justify Center H";
                case 0x250: return "AC Justify Right";
                case 0x251: return "AC Justify Block H";
                case 0x252: return "AC Justify Top";
                case 0x253: return "AC Justify Center V";
                case 0x254: return "AC Justify Bottom";
                case 0x255: return "AC Justify Block V";
                case 0x256: return "AC Indent Decrease";
                case 0x257: return "AC Indent Increase";
                case 0x258: return "AC Numbered List";
                case 0x259: return "AC Restart Numbering";
                case 0x25A: return "AC Bulleted List";
                case 0x25B: return "AC Promote";
                case 0x25C: return "AC Demote";
                case 0x25D: return "AC Yes";
                case 0x25E: return "AC No";
                case 0x25F: return "AC Cancel";
                case 0x260: return "AC Catalog";
                case 0x261: return "AC Buy Checkout";
                case 0x262: return "AC Add to Cart";
                case 0x263: return "AC Expand";
                case 0x264: return "AC Expand All";
                case 0x265: return "AC Collapse";
                case 0x266: return "AC Collapse All";
                case 0x267: return "AC Print Preview";
                case 0x268: return "AC Paste Special";
                case 0x269: return "AC Insert Mode";
                case 0x26A: return "AC Delete";
                case 0x26B: return "AC Lock";
                case 0x26C: return "AC Unlock";
                case 0x26D: return "AC Protect";
                case 0x26E: return "AC Unprotect";
                case 0x26F: return "AC Attach Comment";
                case 0x270: return "AC Delete Comment";
                case 0x271: return "AC View Comment";
                case 0x272: return "AC Select Word";
                case 0x273: return "AC Select Sentence";
                case 0x274: return "AC Select Paragraph";
                case 0x275: return "AC Select Column";
                case 0x276: return "AC Select Row";
                case 0x277: return "AC Select Table";
                case 0x278: return "AC Select Object";
                case 0x279: return "AC Redo Repeat";
                case 0x27A: return "AC Sort";
                case 0x27B: return "AC Sort Ascending";
                case 0x27C: return "AC Sort Descending";
                case 0x27D: return "AC Filter";
                case 0x27E: return "AC Set Clock";
                case 0x27F: return "AC View Clock";
                case 0x280: return "AC Select Time Zone";
                case 0x281: return "AC Edit Time Zones";
                case 0x282: return "AC Set Alarm";
                case 0x283: return "AC Clear Alarm";
                case 0x284: return "AC Snooze Alarm";
                case 0x285: return "AC Reset Alarm";
                case 0x286: return "AC Synchronize";
                case 0x287: return "AC Send Receive";
                case 0x288: return "AC Send To";
                case 0x289: return "AC Reply";
                case 0x28A: return "AC Reply All";
                case 0x28B: return "AC Forward Msg";
                case 0x28C: return "AC Send";
                case 0x28D: return "AC Attach File";
                case 0x28E: return "AC Upload";
                case 0x28F: return "AC Download (Save Target As)";
                case 0x290: return "AC Set Borders";
                case 0x291: return "AC Insert Row";
                case 0x292: return "AC Insert Column";
                case 0x293: return "AC Insert File";
                case 0x294: return "AC Insert Picture";
                case 0x295: return "AC Insert Object";
                case 0x296: return "AC Insert Symbol";
                case 0x297: return "AC Save and Close";
                case 0x298: return "AC Rename";
                case 0x299: return "AC Merge";
                case 0x29A: return "AC Split";
                case 0x29B: return "AC Disribute Horizontally";
                case 0x29C: return "AC Distribute Vertically";
                case 0x29D: return "AC Next Keyboard Layout Select";
                case 0x29E: return "AC Navigation Guidance";
                case 0x29F: return "AC Desktop Show All Windows";
                case 0x2A0: return "AC Soft Key Left";
                case 0x2A1: return "AC Soft Key Right";
                case 0x2A2: return "AC Desktop Show All Applications";
                case 0x2B0: return "AC Idle Keep Alive";
                case 0x2C0: return "Extended Keyboard Attributes Collection";
                case 0x2C1: return "Keyboard Form Factor";
                case 0x2C2: return "Keyboard Key Type";
                case 0x2C3: return "Keyboard Physical Layout";
                case 0x2C4: return "Vendor-Specific Keyboard Physical Layout";
                case 0x2C5: return "Keyboard IETF Language Tag Index";
                case 0x2C6: return "Implemented Keyboard Input Assist Controls";
                case 0x2C7: return "Keyboard Input Assist Previous";
                case 0x2C8: return "Keyboard Input Assist Next";
                case 0x2C9: return "Keyboard Input Assist Previous Group";
                case 0x2CA: return "Keyboard Input Assist Next Group";
                case 0x2CB: return "Keyboard Input Assist Accept";
                case 0x2CC: return "Keyboard Input Assist Cancel";
                case 0x2D0: return "Privacy Screen Toggle";
                case 0x2D1: return "Privacy Screen Level Decrement";
                case 0x2D2: return "Privacy Screen Level Increment";
                case 0x2D3: return "Privacy Screen Level Minimum";
                case 0x2D4: return "Privacy Screen Level Maximum";
                case 0x500: return "Contact Edited";
                case 0x501: return "Contact Added";
                case 0x502: return "Contact Record Active";
                case 0x503: return "Contact Index";
                case 0x504: return "Contact Nickname";
                case 0x505: return "Contact First Name";
                case 0x506: return "Contact Last Name";
                case 0x507: return "Contact Full Name";
                case 0x508: return "Contact Phone Number Personal";
                case 0x509: return "Contact Phone Number Business";
                case 0x50A: return "Contact Phone Number Mobile";
                case 0x50B: return "Contact Phone Number Pager";
                case 0x50C: return "Contact Phone Number Fax";
                case 0x50D: return "Contact Phone Number Other";
                case 0x50E: return "Contact Email Personal";
                case 0x50F: return "Contact Email Business";
                case 0x510: return "Contact Email Other";
                case 0x511: return "Contact Email Main";
                case 0x512: return "Contact Speed Dial Number";
                case 0x513: return "Contact Status Flag";
                case 0x514: return "Contact Misc.";
                default: return "Reserved";
            }
        case 0x0D: break;
        case 0x0E: break;
        case 0x0F: break;
        case 0x10: break;
        case 0x11: break;
        case 0x12: break;
        case 0x14: break;
        case 0x20: break;
        case 0x40: break;
        case 0x41: break;
        case 0x59: break;
        case 0x80: break;
        case 0x81: break;
        case 0x82: break;
        case 0x84: break;
        case 0x85: break;
        case 0x8C: break;
        case 0x8D: break;
        case 0x8E: break;
        case 0x90: break;
        case 0x91: break;
        case 0x92: break;
        case 0xF1D0: break;
        default:
            return null;
    }
}

function handleParts(byte, is_input) {
    let res = (byte & 0x01) ? "Cons" : "Data";
    res += "," + ((byte & 0x02) ? "Arr" : "Var");
    res += "," + (byte & 0x04) ? "Abs" : "Rel";
    res += "," + (byte & 0x08) ? "NWrap" : "Wrap";
    res += "," + (byte & 0x10) ? "Lin" : "NLin";
    res += "," + (byte & 0x20) ? "PrefState" : "NPrefState";
    res += "," + (byte & 0x40) ? "NNull" : "Null";
    if (!is_input) {
        res += "," + (byte & 0x40) ? "NVol" : "Vol";
    }
    res += "," + (byte & 0x80) ? "BitField" : "BuffBytes";

    return res;
}

function handleMainItem(bTag, bSize, bytes, i, opts, indent) {
    const b = bytes[i];
    console.log("Main Item:", { bSize, bTag });
    switch (bTag) {
        case 0xA: { // Collection (1-byte arg)
            if (bSize !== 1) {
                throw new Error("Collection (1-byte arg) expected");
            }

            const val = bytes[i + 1];
            const comment = `Collection (${collectionTypes[val] || val})`;
            const line = joinHex(b, val, opts, 1);
            return { text: line, comment, advance: 2, indentChange: 1 };

        }
        case 0xC: { // End Collection
            if (bSize !== 0) {
                throw new Error("End Collection (0-byte arg) expected");
            }

            const comment = "End Collection";
            const line = joinHex(b, null, opts, 0) + ",";
            return { text: line, comment, advance: 1, indentChange: -1 };
        }
        case 0x8: { // Input (1 byte)
            if (bSize !== 1) {
                throw new Error("Input (1-byte arg) expected");
            }

            const val = bytes[i + 1];
            const comment = `Input (${typeof val === 'number' ? handleParts(val, true) : 'no-data'})`;
            const line = joinHex(b, val, opts, 1);
            return { text: line, comment, advance: 2, indentChange: 0 };
        }
        case 0x9: { // Output (1 byte)
            if (bSize !== 1) {
                throw new Error("Output (1-byte arg) expected");
            }

            const val = bytes[i + 1];
            const comment = `Output (${typeof val === 'number' ? handleParts(val, false) : 'no-data'})`;
            const line = joinHex(b, val, opts, 1);
            return { text: line, comment, advance: 2, indentChange: 0 };
        }
        case 0xB: { // Feature (1 byte)
            if (bSize !== 1) {
                throw new Error("Feature (1-byte arg) expected");
            }

            const val = bytes[i + 1];
            const comment = `Feature (${typeof val === 'number' ? handleParts(val, false) : 'no-data'})`;
            const line = joinHex(b, val, opts, 1);
            return { text: line, comment, advance: 2, indentChange: 0 };
        }
        default: {
            throw new Error(`Unknown Main Item (tag 0x${bTag.toString(16)})`);
        }
    }
}

function extractValue(name, bytes, i, nBytes) {
    if (nBytes <= 0) {
        throw errDataExpected(name);
    }
    const val = readIntLE(bytes, i, nBytes);
    if (val === undefined) {
        throw errUnexpectedEnd(name, nBytes);
    }
    return val;
}

function handleGlobalItem(bTag, bSize, bytes, i, opts) {
    const b = bytes[i];
    const nBytes = (bSize === 3) ? 4 : (bSize ? bSize : 0);
    switch (bTag) {
        case 0x00: { // Usage Page
            const val = extractValue("Usage Page", bytes, i + 1, nBytes);
            const comment = `Usage Page (${usagePages[val] || "Vendor-defined(0x" + (val !== undefined ? val.toString(16) : "?") + ")"})`;
            const line = joinHex(b, val, opts, nBytes);
            return { text: line, comment, advance: 1 + nBytes, indentChange: 0, usagePage: val };
        }
        case 0x01: { // Logical Minimum
            const val = extractValue("Logical Minimum", bytes, i + 1, nBytes);
            const comment = `Logical Minimum (${val})`;
            const line = joinHex(b, val, opts, nBytes);
            return { text: line, comment, advance: 1 + nBytes, indentChange: 0 };
        }
        case 0x02: { // Logical Maximum
            const val = extractValue("Logical Maximum", bytes, i + 1, nBytes);
            const comment = `Logical Maximum (${val})`;
            const line = joinHex(b, val, opts, nBytes);
            return { text: line, comment, advance: 1 + nBytes, indentChange: 0 };
        }
        case 0x03: { // Physical Minimum
            const val = extractValue("Physical Minimum", bytes, i + 1, nBytes);
            const comment = `Physical Minimum (${val})`;
            const line = joinHex(b, val, opts, nBytes);
            return { text: line, comment, advance: 1 + nBytes, indentChange: 0 };
        }
        case 0x04: { // Physical Maximum
            const val = extractValue("Physical Maximum", bytes, i + 1, nBytes);
            const comment = `Physical Maximum (${val})`;
            const line = joinHex(b, val, opts, nBytes);
            return { text: line, comment, advance: 1 + nBytes, indentChange: 0 };
        }
        case 0x05: { // Unit Exponent
            const val = extractValue("Unit Exponent", bytes, i + 1, nBytes);
            const comment = `Unit Exponent (${val})`;
            const line = joinHex(b, val, opts, nBytes);
            return { text: line, comment, advance: 1 + nBytes, indentChange: 0 };
        }
        case 0x06: { // Unit
            const val = extractValue("Unit", bytes, i + 1, nBytes);
            const comment = `Unit (${val})`;
            const line = joinHex(b, val, opts, nBytes);
            return { text: line, comment, advance: 1 + nBytes, indentChange: 0 };
        }
        case 0x07: { // Report Size
            const val = extractValue("Report Size", bytes, i + 1, nBytes);
            const comment = `Report Size (${val})`;
            const line = joinHex(b, val, opts, nBytes);
            return { text: line, comment, advance: 1 + nBytes, indentChange: 0 };
        }
        case 0x08: { // Report ID (1 byte)
            if (nBytes !== 1) {
                throw new Error(`Report ID: (1-byte arg) expected`);
            }
            const val = bytes[i + 1];
            const comment = `Report ID (${val})`;
            const line = joinHex(b, val, opts, 1);
            return { text: line, comment, advance: 2, indentChange: 0 };
        }
        case 0x09: { // Report Count
            const val = extractValue("Report Count", bytes, i + 1, nBytes);
            const comment = `Report Count (${val})`;
            const line = joinHex(b, val, opts, nBytes);
            return { text: line, comment, advance: 1 + nBytes, indentChange: 0 };
        }
        case 0xA0: { // Push (0 bytes)
            if (nBytes <= 0) {
                throw new Error(`Push: (0-byte arg) expected`);
            }
            const comment = "Push";
            const line = joinHex([b], null, opts, 0) + ",";
            return { text: line, comment, advance: 1, indentChange: 0 };
        }
        case 0xB0: { // Pop (0 bytes)
            if (nBytes <= 0) {
                throw new Error(`Pop: (0-byte arg) expected`);
            }
            const comment = "Pop";
            const line = joinHex([b], null, opts, 0) + ",";
            return { text: line, comment, advance: 1, indentChange: 0 };
        }
        default: {
            throw new Error(`Unknown Global (${toHex(b, opts)})`);
        }
    }
}

function handleLocalItem(bTag, bSize, bytes, i, opts, usagePage) {
    const b = bytes[i];
    const nBytes = (bSize === 3) ? 4 : (bSize ? bSize : 0);
    switch (bTag) {
        case 0x00: { // Usage
            const val = extractValue("Usage", bytes, i + 1, nBytes);
            const comment = `Usage (${getUsage(usagePage, val) || joinHex(null, val, opts, nBytes)})`;
            const line = joinHex(b, val, opts, nBytes);
            return { text: line, comment, advance: 1 + nBytes, indentChange: 0 };
        }
        case 0x01: { // Usage Minimum
            const val = extractValue("Usage Minimum", bytes, i + 1, nBytes);
            const comment = `Usage Minimum (${val})`;
            const line = joinHex(b, val, opts, nBytes);
            return { text: line, comment, advance: 1 + nBytes, indentChange: 0 };
        }
        case 0x02: { // Usage Maximum
            const val = extractValue("Usage Maximum", bytes, i + 1, nBytes);
            const comment = `Usage Maximum (${val})`;
            const line = joinHex(b, val, opts, nBytes);
            return { text: line, comment, advance: 1 + nBytes, indentChange: 0 };
        }
        case 0x03: { // Designator Index
            const val = extractValue("Designator Index", bytes, i + 1, nBytes);
            const comment = `Designator Index (${val})`;
            const line = joinHex(b, val, opts, nBytes);
            return { text: line, comment, advance: 1 + nBytes, indentChange: 0 };
        }
        case 0x04: { // Designator Minimum
            const val = extractValue("Designator Minimum", bytes, i + 1, nBytes);
            const comment = `Designator Minimum (${val})`;
            const line = joinHex(b, val, opts, nBytes);
            return { text: line, comment, advance: 1 + nBytes, indentChange: 0 };
        }
        case 0x05: { // Designator Maximum
            const val = extractValue("Designator Maximum", bytes, i + 1, nBytes);
            const comment = `Designator Maximum (${val})`;
            const line = joinHex(b, val, opts, nBytes);
            return { text: line, comment, advance: 1 + nBytes, indentChange: 0 };
        }
        case 0x07: { // String Index
            const val = extractValue("String Index", bytes, i + 1, nBytes);
            const comment = `String Index (${val})`;
            const line = joinHex(b, val, opts, nBytes);
            return { text: line, comment, advance: 1 + nBytes, indentChange: 0 };
        }
        case 0x08: { // String Minimum
            const val = extractValue("String Minimum", bytes, i + 1, nBytes);
            const comment = `String Minimum (${val})`;
            const line = joinHex(b, val, opts, nBytes);
            return { text: line, comment, advance: 1 + nBytes, indentChange: 0 };
        }
        case 0x09: { // String Maximum
            const val = extractValue("String Maximum", bytes, i + 1, nBytes);
            const comment = `String Maximum (${val})`;
            const line = joinHex(b, val, opts, nBytes);
            return { text: line, comment, advance: 1 + nBytes, indentChange: 0 };
        }
        case 0x0A: { // Delimiter
            const val = extractValue("Delimiter", bytes, i + 1, nBytes);
            const comment = `Delimiter (${val})`;
            const line = joinHex(b, val, opts, nBytes);
            return { text: line, comment, advance: 1 + nBytes, indentChange: 0 };
        }
        default: {
            throw new Error(`Unknown Local (${toHex(b, opts)})`);
        }
    }
}

function handleShortItem(bytes, i, opts, indent, usagePage) {
    const b = bytes[i];
    const bSize = b & 0x03;
    const bType = (b >> 2) & 0x03;
    const bTag = (b >> 4) & 0x0F;

    switch (bType) {
        case 0:
            return handleMainItem(bTag, bSize, bytes, i, opts, indent);
        case 1:
            return handleGlobalItem(bTag, bSize, bytes, i, opts);
        case 2:
            return handleLocalItem(bTag, bSize, bytes, i, opts, usagePage);
        default:
            const comment = `Unknown (${toHex(b, opts)})`;
            const line = joinHex([b], opts) + ",";
            return { text: line, comment, advance: 1, indentChange: 0, error: true };
    }
}

export { handleShortItem };