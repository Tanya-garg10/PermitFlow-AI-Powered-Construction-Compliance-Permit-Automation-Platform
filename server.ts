import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Create Express app
const app = express();
const PORT = 3000;

// Initialize Google Gen AI client with safe fallback
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
    console.log("Gemini API Client initialized successfully.");
  } catch (err) {
    console.error("Failed to initialize Gemini Client:", err);
  }
} else {
  console.log("GEMINI_API_KEY is not defined. Falling back to rule-based simulations.");
}

// Middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// --- MOCK DATABASE AND CONFIGURATION ---

let projects = [
  {
    id: "proj-1",
    name: "Greenfield Residential Villa",
    location: "Sector 15, Gurugram, HR",
    plotArea: 400,
    buildingType: "Residential",
    floors: 2,
    height: 7.5,
    status: "Draft",
    complianceScore: 100,
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    creatorId: "user-contractor",
    creatorName: "Rajesh Kumar",
    blueprintUrl: "blueprint_residential_draft_v1.pdf",
    siteImageUrl: "site_residential_gurugram.jpg",
    riskScore: "Low",
    documentsRequested: [] as string[],
    duplicateDetected: false,
    extractedData: {
      projectType: "Residential Villa",
      totalArea: 320,
      floors: 2,
      height: 7.5,
      parkingSpaces: 2,
      fireSafetyStatus: "Compliant (Extinguishers provided)",
      structuralNotes: "RCC framed structure with brick masonry infill. Complies with Zone IV earthquake specifications.",
      environmentalNotes: "Rainwater harvesting planned. 20% area reserved for green cover.",
      occupancyType: "Single Family",
      farValue: 0.8,
      setbackFront: 4.5,
      setbackSides: 2.0
    },
    complianceReport: {
      projectId: "proj-1",
      complianceScore: 100,
      issues: [
        {
          id: "issue-1-1",
          category: "Zoning",
          ruleName: "Front Setback Requirement",
          expected: "Min 3.0 m",
          actual: "4.5 m",
          status: "Pass",
          message: "Front setback is well within the acceptable zoning parameters.",
          suggestion: "Excellent. Keep building layout unchanged."
        },
        {
          id: "issue-1-2",
          category: "BuildingCode",
          ruleName: "Maximum Height Limit",
          expected: "Max 15.0 m",
          actual: "7.5 m",
          status: "Pass",
          message: "Height is compliant with residential neighborhood regulations.",
          suggestion: "None needed."
        },
        {
          id: "issue-1-3",
          category: "Parking",
          ruleName: "Minimum Parking Spaces",
          expected: "Min 1 space",
          actual: "2 spaces",
          status: "Pass",
          message: "Adequate residential parking space allocated.",
          suggestion: "Ensure clear entry/exit lanes."
        }
      ],
      requiredApprovals: ["Municipal Fire Board Clearance", "Zoning Clearance Certificate"],
      timelineEstDays: 14,
      generatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
    },
    formDetails: {
      applicantName: "Rajesh Kumar",
      applicantAddress: "H-45, Green Park, New Delhi",
      surveyNumber: "SRV-2026-904",
      plotArea: 400,
      proposedHeight: 7.5,
      proposedFloors: 2,
      buildingUse: "Residential",
      ownerName: "Subhash Chawla",
      architectLicense: "COA/2019/84732",
      estimatedCost: "₹1,20,00,000"
    }
  },
  {
    id: "proj-2",
    name: "Skyline Commercial Hub",
    location: "Bandra Kurla Complex, Mumbai, MH",
    plotArea: 5000,
    buildingType: "Commercial",
    floors: 12,
    height: 45.0,
    status: "Submitted",
    complianceScore: 92,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    creatorId: "user-architect",
    creatorName: "Priya Sharma",
    blueprintUrl: "bkccommercialhub_masterplan.pdf",
    siteImageUrl: "bkc_mumbai_plot.jpg",
    riskScore: "Low",
    documentsRequested: [] as string[],
    duplicateDetected: false,
    extractedData: {
      projectType: "Commercial Office Tower",
      totalArea: 14200,
      floors: 12,
      height: 45.0,
      parkingSpaces: 95,
      fireSafetyStatus: "High Risk (Fire suppression systems, sprinklers, 2 emergency exits specified)",
      structuralNotes: "Steel-concrete composite construction. Designed by licensed structural engineers for high seismic loads.",
      environmentalNotes: "LEED Gold pre-certification requested. Wastewater treatment plant on-site.",
      occupancyType: "Business / Offices",
      farValue: 2.84,
      setbackFront: 8.0,
      setbackSides: 5.5
    },
    complianceReport: {
      projectId: "proj-2",
      complianceScore: 92,
      issues: [
        {
          id: "issue-2-1",
          category: "Zoning",
          ruleName: "Floor Area Ratio (FAR)",
          expected: "Max 3.0",
          actual: "2.84",
          status: "Pass",
          message: "Calculated FAR complies with Bandra-Kurla commercial zoning rules.",
          suggestion: "Safe to proceed with current square footage."
        },
        {
          id: "issue-2-2",
          category: "FireSafety",
          ruleName: "Wet Riser and Sprinkler System",
          expected: "Mandatory for commercial > 3 floors",
          actual: "Sprinkler & Wet Riser provided",
          status: "Pass",
          message: "Advanced fire suppression plans fully integrated.",
          suggestion: "Confirm fire nozzle coordinates in the secondary fire layout."
        },
        {
          id: "issue-2-3",
          category: "Parking",
          ruleName: "Minimum Parking Ratio",
          expected: "Min 1 space per 50 sqm (100 spaces needed)",
          actual: "95 spaces",
          status: "Warning",
          message: "Parking allocation is slightly below the recommended municipal limit by 5 spaces.",
          suggestion: "Incorporate basement stack-parking or allocate 5 additional exterior spaces to prevent rejection."
        }
      ],
      requiredApprovals: ["Municipal Corporation Fire NOC", "Aviation Height Clearance", "Environmental Impact Assessment (EIA) Certificate"],
      timelineEstDays: 45,
      generatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    formDetails: {
      applicantName: "Priya Sharma",
      applicantAddress: "Elite Designs, Lower Parel, Mumbai",
      surveyNumber: "BKC-BLOCK-G-102",
      plotArea: 5000,
      proposedHeight: 45.0,
      proposedFloors: 12,
      buildingUse: "Commercial Offices",
      ownerName: "Skyline Infrastructure Ltd",
      architectLicense: "COA/2012/50211",
      estimatedCost: "₹45,50,00,000"
    }
  },
  {
    id: "proj-3",
    name: "Heritage Mixed-Use Plaza",
    location: "MG Road, Bengaluru, KA",
    plotArea: 1200,
    buildingType: "Mixed Use",
    floors: 5,
    height: 18.5,
    status: "Under Review",
    complianceScore: 84,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    creatorId: "user-contractor",
    creatorName: "Anil Patel",
    blueprintUrl: "mixed_use_mg_road.pdf",
    siteImageUrl: "mg_road_bengaluru.jpg",
    riskScore: "Medium",
    documentsRequested: ["Fire NOC Application Receipt"],
    duplicateDetected: false,
    extractedData: {
      projectType: "Mixed-Use Retail + Residential",
      totalArea: 3240,
      floors: 5,
      height: 18.5,
      parkingSpaces: 14,
      fireSafetyStatus: "Medium Risk (Manual alarms and fire extinguishers only)",
      structuralNotes: "Reinforced concrete columns. Retrofitting specified for older foundation boundary.",
      environmentalNotes: "No green cover area specified in plans.",
      occupancyType: "Retail Ground + 4 Residential Floors",
      farValue: 2.7,
      setbackFront: 4.0,
      setbackSides: 2.5
    },
    complianceReport: {
      projectId: "proj-3",
      complianceScore: 84,
      issues: [
        {
          id: "issue-3-1",
          category: "Zoning",
          ruleName: "Mixed-Use Floor Area Ratio",
          expected: "Max 2.8",
          actual: "2.7",
          status: "Pass",
          message: "Zoning FAR is within the acceptable 2.8 threshold.",
          suggestion: "None."
        },
        {
          id: "issue-3-2",
          category: "FireSafety",
          ruleName: "Wet Riser and Dedicated Water Tank",
          expected: "Required for height > 15m",
          actual: "Extinguishers only",
          status: "Violation",
          message: "Fire safety wet-riser lines are completely missing for an 18.5m mixed-use project.",
          suggestion: "Redesign utility column to support a dedicated wet-riser pump and roof-top storage water tank."
        },
        {
          id: "issue-3-3",
          category: "Environmental",
          ruleName: "Mandatory Green Cover",
          expected: "Min 15% plot area (180 sqm)",
          actual: "0% specified",
          status: "Violation",
          message: "No landscaping or softscape green cover provided.",
          suggestion: "Add rooftop planters or pocket garden layout to satisfy 180 sqm softscape requirement."
        }
      ],
      requiredApprovals: ["Municipal Building Board Approval", "Traffic Police NOC", "State Pollution Control Board Consent"],
      timelineEstDays: 30,
      generatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    },
    formDetails: {
      applicantName: "Anil Patel",
      applicantAddress: "Nagarbhavi Main Road, Bengaluru",
      surveyNumber: "MGR-SRV-412",
      plotArea: 1200,
      proposedHeight: 18.5,
      proposedFloors: 5,
      buildingUse: "Mixed Use",
      ownerName: "Patel Properties LLP",
      architectLicense: "COA/2015/67382",
      estimatedCost: "₹8,80,00,000"
    }
  },
  {
    id: "proj-4",
    name: "Old Town Industrial Complex",
    location: "Old Town Industrial Zone, Delhi, DL",
    plotArea: 1500,
    buildingType: "Industrial",
    floors: 4,
    height: 16.0,
    status: "Rejected",
    complianceScore: 54,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    creatorId: "user-architect",
    creatorName: "Priya Sharma",
    blueprintUrl: "oldtown_factory_v2.pdf",
    siteImageUrl: "oldtown_delhi_factory.jpg",
    riskScore: "High",
    officerNotes: "Severe setbacks and height violations in Old Town high-density zone. Fire safety precautions are completely absent. High hazard industrial occupancy requires 12m wide access road; current plot sits on a 6m road. Revise plans entirely.",
    documentsRequested: [] as string[],
    duplicateDetected: true,
    extractedData: {
      projectType: "Industrial Manufacturing Facility",
      totalArea: 4800,
      floors: 4,
      height: 16.0,
      parkingSpaces: 5,
      fireSafetyStatus: "Critical Hazard (Chemical storage listed near electrical room)",
      structuralNotes: "Heavy machinery vibrations not addressed in foundation loads.",
      environmentalNotes: "Waste disposal details missing.",
      occupancyType: "Industrial (High Hazard Class)",
      farValue: 3.2,
      setbackFront: 1.5,
      setbackSides: 1.0
    },
    complianceReport: {
      projectId: "proj-4",
      complianceScore: 54,
      issues: [
        {
          id: "issue-4-1",
          category: "Zoning",
          ruleName: "Maximum Industrial FAR",
          expected: "Max 1.5",
          actual: "3.2",
          status: "Violation",
          message: "Zoning limits FAR to 1.5 for this heritage corridor. The proposed 3.2 exceeds rules by 113%.",
          suggestion: "Reduce project size or eliminate top 2 floors to comply with regional FAR restrictions."
        },
        {
          id: "issue-4-2",
          category: "Zoning",
          ruleName: "Road Width Requirement",
          expected: "Min 12.0 m access road",
          actual: "6.0 m road",
          status: "Violation",
          message: "Road access is too narrow for industrial heavy vehicles and fire engines.",
          suggestion: "Zoning variance required, or convert building use to light-warehousing with lower traffic loads."
        },
        {
          id: "issue-4-3",
          category: "Zoning",
          ruleName: "Front Setback Requirement",
          expected: "Min 5.0 m",
          actual: "1.5 m",
          status: "Violation",
          message: "Building encroaches into municipal road buffer lane.",
          suggestion: "Set back the front building wall by an additional 3.5m."
        },
        {
          id: "issue-4-4",
          category: "FireSafety",
          ruleName: "Emergency Chemical Containment",
          expected: "Mandatory segregated chemical storage",
          actual: "Adjacent to electrical control room",
          status: "Violation",
          message: "High safety hazard. Chemical storage and electrical control panels must be separated by fire-rated walls.",
          suggestion: "Relocate chemical storage to a separate outbuilding or install 2-hour fire-rated partitions."
        }
      ],
      requiredApprovals: ["Chief Fire Officer Clearance NOC", "Industrial Development Corp Approval", "Delhi Pollution Control Committee Consent"],
      timelineEstDays: 90,
      generatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
    },
    formDetails: {
      applicantName: "Priya Sharma",
      applicantAddress: "Elite Designs, Lower Parel, Mumbai",
      surveyNumber: "OT-IND-771",
      plotArea: 1500,
      proposedHeight: 16.0,
      proposedFloors: 4,
      buildingUse: "Industrial Manufacturing",
      ownerName: "Vikas Castings Ltd",
      architectLicense: "COA/2012/50211",
      estimatedCost: "₹5,20,00,000"
    }
  }
];

let regulations = [
  { id: "reg-1", category: "Zoning", name: "Floor Area Ratio (FAR) Limit", description: "Defines maximum built-up area relative to plot size.", limitType: "max", value: 2.5, unit: "ratio" },
  { id: "reg-2", category: "Zoning", name: "Residential Maximum Height", description: "Maximum height permissible in standard residential plots.", limitType: "max", value: 15.0, unit: "m" },
  { id: "reg-3", category: "Zoning", name: "Commercial Maximum Height", description: "Maximum height permissible for commercial developments.", limitType: "max", value: 50.0, unit: "m" },
  { id: "reg-4", category: "Zoning", name: "Minimum Front Setback", description: "Minimum open space between the building front and street plot boundary.", limitType: "min", value: 3.0, unit: "m" },
  { id: "reg-5", category: "Zoning", name: "Minimum Side Setback", description: "Minimum open space required along plot boundary flanks.", limitType: "min", value: 1.5, unit: "m" },
  { id: "reg-6", category: "FireSafety", name: "Wet Riser System Requirement", description: "Dedicated wet fire nozzles mandatory for structures above certain thresholds.", limitType: "min", value: 15.0, unit: "m" },
  { id: "reg-7", category: "Parking", name: "Minimum Parking Allocation", description: "Required parking spaces per 100 sqm of total plot area.", limitType: "min", value: 1.0, unit: "spaces/100sqm" },
  { id: "reg-8", category: "Environmental", name: "Softscape Green Cover", description: "Percentage of site area reserved exclusively for grass, trees, and gardens.", limitType: "min", value: 15, unit: "%" }
];

// In-Memory User session tokens / logs for simple JWT demo
const activeUsers = [
  { email: "taniyagarg1007@gmail.com", role: "Contractor" },
  { email: "contractor@permitflow.com", role: "Contractor" },
  { email: "architect@permitflow.com", role: "Architect" },
  { email: "officer@permitflow.com", role: "Municipal Officer" },
  { email: "admin@permitflow.com", role: "Admin" }
];

// Helper to calculate compliance dynamically
function generateComplianceReport(p: typeof projects[0]): typeof projects[0]['complianceReport'] {
  const issues: any[] = [];
  let score = 100;
  
  // Calculate FAR
  const totalBuiltUp = p.plotArea * p.floors * 0.8; // Simulating 80% coverage per floor
  const calculatedFAR = totalBuiltUp / p.plotArea;
  
  // Rule 1: FAR Check
  let farLimit = 2.5;
  if (p.buildingType === "Commercial") farLimit = 3.0;
  if (p.buildingType === "Mixed Use") farLimit = 2.8;
  if (p.buildingType === "Industrial") farLimit = 1.5;

  if (calculatedFAR > farLimit) {
    const excess = ((calculatedFAR - farLimit) / farLimit * 100).toFixed(0);
    issues.push({
      id: `iss-${p.id}-far`,
      category: "Zoning",
      ruleName: "Floor Area Ratio (FAR) Limit",
      expected: `Max ${farLimit}`,
      actual: `${calculatedFAR.toFixed(2)}`,
      status: "Violation",
      message: `The calculated FAR of ${calculatedFAR.toFixed(2)} exceeds the municipal ceiling of ${farLimit} by ${excess}%.`,
      suggestion: "Reduce the number of floors, scale down floor layout coverage, or apply for a TDR (Transferable Development Rights) buffer."
    });
    score -= 25;
  } else {
    issues.push({
      id: `iss-${p.id}-far-p`,
      category: "Zoning",
      ruleName: "Floor Area Ratio (FAR) Limit",
      expected: `Max ${farLimit}`,
      actual: `${calculatedFAR.toFixed(2)}`,
      status: "Pass",
      message: `Permissible built-up area complies with local zoning bounds.`,
      suggestion: "Keep FAR unchanged."
    });
  }

  // Rule 2: Height limits
  let maxH = 15.0;
  if (p.buildingType === "Commercial") maxH = 50.0;
  if (p.buildingType === "Mixed Use") maxH = 25.0;
  if (p.buildingType === "Industrial") maxH = 20.0;

  if (p.height > maxH) {
    issues.push({
      id: `iss-${p.id}-h`,
      category: "BuildingCode",
      ruleName: "Permissible Height Limit",
      expected: `Max ${maxH} m`,
      actual: `${p.height} m`,
      status: "Violation",
      message: `Building height is higher than the permitted limit of ${maxH}m in this municipal zone.`,
      suggestion: "Compress ceiling heights on each deck or drop the top floor structure from plans."
    });
    score -= 20;
  } else {
    issues.push({
      id: `iss-${p.id}-h-p`,
      category: "BuildingCode",
      ruleName: "Permissible Height Limit",
      expected: `Max ${maxH} m`,
      actual: `${p.height} m`,
      status: "Pass",
      message: "Building height satisfies structural guidelines for this street zone.",
      suggestion: "Maintain height plans."
    });
  }

  // Rule 3: Fire Safety
  if (p.height > 15.0 || p.floors > 3) {
    issues.push({
      id: `iss-${p.id}-fire`,
      category: "FireSafety",
      ruleName: "Wet Riser fire Line",
      expected: "Mandatory (Height > 15m or Floors > 3)",
      actual: "Extinguishers only / Check needed",
      status: "Warning",
      message: "For buildings of this scale, simple extinguishers are insufficient. A dedicated wet riser fire pipe system is mandated.",
      suggestion: "Ensure architectural layouts feature continuous wet-riser lines and a 10,000L rooftop fire buffer tank."
    });
    score -= 10;
  } else {
    issues.push({
      id: `iss-${p.id}-fire-p`,
      category: "FireSafety",
      ruleName: "Wet Riser fire Line",
      expected: "Optional (Height <= 15m)",
      actual: "Extinguishers only",
      status: "Pass",
      message: "Fire safety specifications comply with single-occupant / low-height guidelines.",
      suggestion: "Ensure visual marking of exits."
    });
  }

  // Rule 4: Parking allocation
  let reqParkingRate = 1.0; // spaces per 100 sqm
  if (p.buildingType === "Commercial") reqParkingRate = 2.0;
  if (p.buildingType === "Mixed Use") reqParkingRate = 1.5;
  if (p.buildingType === "Industrial") reqParkingRate = 0.5;

  const minParkingNeeded = Math.ceil((p.plotArea / 100) * reqParkingRate);
  // Simulating 5 parking spaces if draft, or what's listed in extracted
  const providedParking = p.extractedData ? p.extractedData.parkingSpaces : 4;

  if (providedParking < minParkingNeeded) {
    issues.push({
      id: `iss-${p.id}-park`,
      category: "Parking",
      ruleName: "Minimum Parking Allotment",
      expected: `Min ${minParkingNeeded} spaces`,
      actual: `${providedParking} spaces`,
      status: "Warning",
      message: `Proposed layout has ${providedParking} parking slots, failing the required density of ${minParkingNeeded} spaces.`,
      suggestion: "Designate additional parking bays in side setbacks or implement basement stacking systems."
    });
    score -= 5;
  } else {
    issues.push({
      id: `iss-${p.id}-park-p`,
      category: "Parking",
      ruleName: "Minimum Parking Allotment",
      expected: `Min ${minParkingNeeded} spaces`,
      actual: `${providedParking} spaces`,
      status: "Pass",
      message: "Allocated parking matches standard commercial/residential densities.",
      suggestion: "Verify handicap parking bays are labeled clearly near entrance."
    });
  }

  const finalScore = Math.max(50, score);
  const requiredApprovals: string[] = [];
  if (p.buildingType === "Commercial" || p.buildingType === "Mixed Use") {
    requiredApprovals.push("Municipal Fire NOC", "Aviation Height Clearance", "Environmental Impact Certificate");
  } else if (p.buildingType === "Industrial") {
    requiredApprovals.push("Industrial Board Consent", "Pollution Control NOC", "Fire Chief Approval");
  } else {
    requiredApprovals.push("Zoning Clearance", "Structural Board Sign-off");
  }

  return {
    projectId: p.id,
    complianceScore: finalScore,
    issues: issues,
    requiredApprovals: requiredApprovals,
    timelineEstDays: finalScore > 90 ? 15 : finalScore > 75 ? 30 : 60,
    generatedAt: new Date().toISOString()
  };
}

// --- API ENDPOINTS ---

// Auth Endpoints (Simulated)
app.post("/api/auth/register", (req, res) => {
  const { email, name, role } = req.body;
  const existingUser = activeUsers.find(u => u.email === email);
  if (existingUser) {
    return res.status(200).json({ message: "User already exists", email, name, role, otpVerified: false });
  }
  activeUsers.push({ email, role });
  return res.json({ message: "Registration successful. OTP sent.", email, name, role, otpVerified: false });
});

app.post("/api/auth/verify-otp", (req, res) => {
  const { email, otp } = req.body;
  if (otp === "1234" || otp === "123456" || otp) {
    const user = activeUsers.find(u => u.email === email) || { email, role: "Contractor" };
    return res.json({
      token: "mock-jwt-token-xyz-987",
      user: {
        id: "usr-" + Math.floor(Math.random() * 1000),
        email: user.email,
        name: email.split("@")[0].toUpperCase(),
        role: user.role,
        otpVerified: true
      }
    });
  }
  return res.status(400).json({ error: "Invalid OTP. Please enter 1234 to bypass." });
});

app.post("/api/auth/login", (req, res) => {
  const { email } = req.body;
  const matched = activeUsers.find(u => u.email === email);
  if (matched) {
    return res.json({ message: "OTP sent to your email/SMS. Enter '1234' to login.", email, role: matched.role });
  } else {
    // Auto-create user for testing ease
    const defaultRole = email.includes("officer") ? "Municipal Officer" : email.includes("admin") ? "Admin" : email.includes("architect") ? "Architect" : "Contractor";
    activeUsers.push({ email, role: defaultRole });
    return res.json({ message: "Welcome! New account created. OTP sent.", email, role: defaultRole });
  }
});

// Regulations Endpoints
app.get("/api/regulations", (req, res) => {
  res.json(regulations);
});

app.post("/api/regulations", (req, res) => {
  const { category, name, description, limitType, value, unit } = req.body;
  const newReg = {
    id: "reg-" + (regulations.length + 1),
    category,
    name,
    description,
    limitType,
    value: Number(value),
    unit
  };
  regulations.push(newReg);
  res.json({ message: "Regulation added successfully", regulation: newReg });
});

app.delete("/api/regulations/:id", (req, res) => {
  const id = req.params.id;
  regulations = regulations.filter(r => r.id !== id);
  res.json({ message: "Regulation deleted successfully" });
});

// Projects Endpoints
app.get("/api/projects", (req, res) => {
  res.json(projects);
});

app.get("/api/projects/:id", (req, res) => {
  const proj = projects.find(p => p.id === req.params.id);
  if (!proj) return res.status(404).json({ error: "Project not found" });
  res.json(proj);
});

app.post("/api/projects", (req, res) => {
  const { name, location, plotArea, buildingType, floors, height, blueprintUrl, siteImageUrl, formDetails } = req.body;
  const id = "proj-" + (projects.length + 1);

  // Default mock extractions for fallback
  const mockExtracted = {
    projectType: `${buildingType} Building`,
    totalArea: Math.floor(plotArea * floors * 0.8),
    floors: Number(floors),
    height: Number(height),
    parkingSpaces: Math.floor(plotArea / 120),
    fireSafetyStatus: floors > 3 ? "Standard risk (extinguishers only)" : "Compliant (Basic units)",
    structuralNotes: "Frame structural layout specified.",
    environmentalNotes: "Standard setback landscape specified.",
    occupancyType: buildingType === "Residential" ? "Single / Multi family residential" : "Commercial office space",
    farValue: Number(((plotArea * floors * 0.8) / plotArea).toFixed(2)),
    setbackFront: 3.5,
    setbackSides: 2.0
  };

  const newProj: any = {
    id,
    name,
    location,
    plotArea: Number(plotArea),
    buildingType,
    floors: Number(floors),
    height: Number(height),
    blueprintUrl: blueprintUrl || "uploaded_blueprint.pdf",
    siteImageUrl: siteImageUrl || "site_image.jpg",
    status: "Draft",
    complianceScore: 100,
    createdAt: new Date().toISOString(),
    creatorId: "user-contractor",
    creatorName: "Demonstration User",
    riskScore: "Low",
    documentsRequested: [],
    duplicateDetected: false,
    extractedData: mockExtracted,
    formDetails: formDetails || {
      applicantName: "Demonstration User",
      applicantAddress: "12, Smart City Avenue",
      surveyNumber: "SURV-" + Math.floor(Math.random() * 9000 + 1000),
      plotArea: Number(plotArea),
      proposedHeight: Number(height),
      proposedFloors: Number(floors),
      buildingUse: buildingType,
      ownerName: "Client Properties Ltd",
      architectLicense: "COA/2026/" + Math.floor(Math.random() * 90000 + 10000),
      estimatedCost: `₹${(Math.floor(plotArea * floors * 15000)).toLocaleString('en-IN')}`
    }
  };

  // Run initial compliance calculation
  newProj.complianceReport = generateComplianceReport(newProj);
  newProj.complianceScore = newProj.complianceReport.complianceScore;
  if (newProj.complianceScore < 70) {
    newProj.riskScore = "High";
  } else if (newProj.complianceScore < 90) {
    newProj.riskScore = "Medium";
  } else {
    newProj.riskScore = "Low";
  }

  projects.unshift(newProj);
  res.json({ message: "Project created and compliance checked", project: newProj });
});

app.post("/api/projects/:id/submit", (req, res) => {
  const proj = projects.find(p => p.id === req.params.id);
  if (!proj) return res.status(404).json({ error: "Project not found" });
  proj.status = "Submitted";
  res.json({ message: "Project submitted for municipal verification", project: proj });
});

app.put("/api/projects/:id", (req, res) => {
  const proj = projects.find(p => p.id === req.params.id);
  if (!proj) return res.status(404).json({ error: "Project not found" });

  const { status, officerNotes, documentsRequested, duplicateDetected, riskScore } = req.body;
  if (status) proj.status = status;
  if (officerNotes !== undefined) proj.officerNotes = officerNotes;
  if (documentsRequested !== undefined) proj.documentsRequested = documentsRequested;
  if (duplicateDetected !== undefined) proj.duplicateDetected = duplicateDetected;
  if (riskScore !== undefined) proj.riskScore = riskScore;

  res.json({ message: "Project updated successfully", project: proj });
});

// OCR & Sarvam AI Document Intelligence Simulation Route
app.post("/api/document-intelligence", async (req, res) => {
  const { name, location, plotArea, buildingType, floors, height } = req.body;
  
  if (!ai) {
    // Mock response if no Gemini API Key is provided
    return res.json({
      projectType: `${buildingType} Multiplex`,
      totalArea: Math.floor(plotArea * floors * 0.78),
      floors: Number(floors),
      height: Number(height),
      parkingSpaces: Math.floor(plotArea / 90),
      fireSafetyStatus: "Wet risers, fire extinguishers and double fire doors required.",
      structuralNotes: "RCC heavy construction. Foundation designed to carry double vibration load factor.",
      environmentalNotes: "Requires rainwater harvesting pits and softscape cover of at least 15% plot area.",
      occupancyType: buildingType === "Residential" ? "Multi-family Residential" : "Business Office Retail",
      farValue: Number(((plotArea * floors * 0.78) / plotArea).toFixed(2)),
      setbackFront: 5.0,
      setbackSides: 3.0,
      aiSummary: `We've parsed the blueprint for ${name} at ${location}. The layout presents a total build-up footprint of ${Math.floor(plotArea * floors * 0.78)} sqm over ${floors} floors. Structural load bearings support high seismic coefficients. Side and front setbacks satisfy standard municipal criteria.`
    });
  }

  try {
    const prompt = `
      You are the "Sarvam AI Document Intelligence Engine" for municipal building permit reviews.
      You have received a project with the following properties:
      - Project Name: ${name}
      - Location: ${location}
      - Plot Area: ${plotArea} sqm
      - Building Type: ${buildingType}
      - Floors: ${floors}
      - Height: ${height} meters
      
      Simulate that you have completed deep OCR on its blueprint file.
      Return a JSON object containing the exact properties specified below. Be highly realistic and specific to municipal building parameters.

      Requirements:
      Generate valid JSON only. Do not wrap in markdown quotes. The JSON should match this schema exactly:
      {
        "projectType": "A realistic specific sub-type, e.g. 'Premium Commercial Office Plaza' or 'Multi-storey Residential Complex'",
        "totalArea": number (calculate plotArea * floors * random coefficient between 0.7 and 0.85),
        "floors": number (must match ${floors}),
        "height": number (must match ${height}),
        "parkingSpaces": number (a realistic parking count matching building size),
        "fireSafetyStatus": "A brief structural sentence describing emergency exit counts, sprinklers, or lack thereof",
        "structuralNotes": "Realistic engineering notes about load bearing columns and seismic zone design criteria",
        "environmentalNotes": "A brief sentence summarizing greywater recycling or soft landscaping boundaries",
        "occupancyType": "Specific occupant category matching building type",
        "farValue": number (totalArea divided by plotArea),
        "setbackFront": number (realistic setback distance in meters, e.g., between 1.5 and 6.0),
        "setbackSides": number (realistic side setback distance in meters, e.g., between 1.0 and 4.0),
        "aiSummary": "A beautifully drafted 2-sentence executive summary of structural and zoning compliance."
      }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const parsedData = JSON.parse(response.text?.trim() || "{}");
    res.json(parsedData);
  } catch (err: any) {
    console.error("Gemini AI Intelligence error:", err);
    res.status(500).json({ error: "AI reasoning failed, please try again." });
  }
});

// Sarvam AI Assistant Chatbot with regulation context
app.post("/api/chat", async (req, res) => {
  const { messages, projectContext } = req.body;
  const userMessage = messages[messages.length - 1].text;

  const systemInstruction = `
    You are "Sarvam AI Compliance Autopilot" for PermitFlow.
    You assist contractors, architects, and builders with municipal regulations, setback compliance, FAR queries, and fire NOC requisites.
    Use this project context if provided to answer the user's questions specifically:
    ${JSON.stringify(projectContext || {})}

    Here are the global municipal zoning codes to reference:
    - FAR Limits: Commercial=3.0, Mixed-Use=2.8, Residential=2.5, Industrial=1.5
    - Height Permissible: Commercial=50m, Mixed-Use=25m, Residential=15m, Industrial=20m
    - Front Setbacks: Commercial/Mixed-Use/Industrial=Min 5.0m, Residential=Min 3.0m
    - Side Setbacks: Commercial/Mixed-Use/Industrial=Min 3.0m, Residential=Min 1.5m
    - Parking: Residential=1 space/100 sqm, Commercial=2 spaces/100 sqm, Mixed-Use=1.5 spaces/100 sqm
    - Fire NOC: Mandatory for all structures with height > 15m or floors > 3.

    Always answer in clear, professional, direct, human-friendly terms. Avoid robotic jargon, keep it structured, highlight warnings or violations of setbacks or FAR if any exist in the projectContext, and supply precise guidance.
  `;

  if (!ai) {
    // Extremely helpful standard fallback
    let responseText = "As your AI Compliance assistant, I am happy to help! ";
    if (userMessage.toLowerCase().includes("fire noc") || userMessage.toLowerCase().includes("fire safety")) {
      responseText = "Yes, you require a Fire NOC! In this municipality, a Chief Fire Officer NOC is mandatory for any building taller than 15 meters or over 3 floors in height. Your plans must show dual fire exits, emergency alarms, and active wet-riser pipe systems to receive fire board approval.";
    } else if (userMessage.toLowerCase().includes("setback") || userMessage.toLowerCase().includes("boundary")) {
      responseText = "Zoning rules state that the front setback must be a minimum of 3.0 meters for residential areas, and 5.0 meters for commercial or mixed-use properties. Sideline setback borders must be at least 1.5 meters for residential and 3.0 meters for commercial structures. Please double-check your current drawing layout.";
    } else if (userMessage.toLowerCase().includes("floor") || userMessage.toLowerCase().includes("far")) {
      responseText = "Your permissible Floor Area Ratio (FAR) depends on your zoning category. Commercial sectors permit a maximum FAR of 3.0, Residential sectors permit 2.5, and Mixed-Use sectors permit 2.8. Exceeding this will cause a critical violation and trigger automatic rejection.";
    } else {
      responseText = `I have received your query: "${userMessage}". For this project (${projectContext?.name || 'New Project'} in ${projectContext?.location || 'Smart City'}), municipal rules govern height limits of up to ${projectContext?.buildingType === "Commercial" ? "50" : "15"}m and setbacks. Make sure your design aligns with these zoning restrictions! What specific rule or section would you like me to analyze next?`;
    }

    return res.json({ text: responseText });
  }

  try {
    // Find the first message from the user to ensure history starts with a user message (required by Gemini API)
    const firstUserIndex = messages.findIndex((m: any) => m.sender === "user");
    const activeMessages = firstUserIndex !== -1 ? messages.slice(firstUserIndex) : messages;

    const formattedMessages = activeMessages.map((m: any) => ({
      role: m.sender === "user" ? "user" : "model",
      parts: [{ text: m.text }]
    }));

    // Inject system instruction in config
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: formattedMessages,
      config: {
        systemInstruction
      }
    });

    res.json({ text: response.text });
  } catch (err: any) {
    console.error("Gemini Chat error, using smart fallback simulation:", err);
    
    // Extremely helpful standard fallback
    let responseText = "As your AI Compliance assistant, I am happy to help! ";
    if (userMessage.toLowerCase().includes("fire noc") || userMessage.toLowerCase().includes("fire safety")) {
      responseText = "Yes, you require a Fire NOC! In this municipality, a Chief Fire Officer NOC is mandatory for any building taller than 15 meters or over 3 floors in height. Your plans must show dual fire exits, emergency alarms, and active wet-riser pipe systems to receive fire board approval.";
    } else if (userMessage.toLowerCase().includes("setback") || userMessage.toLowerCase().includes("boundary")) {
      responseText = "Zoning rules state that the front setback must be a minimum of 3.0 meters for residential areas, and 5.0 meters for commercial or mixed-use properties. Sideline setback borders must be at least 1.5 meters for residential and 3.0 meters for commercial structures. Please double-check your current drawing layout.";
    } else if (userMessage.toLowerCase().includes("floor") || userMessage.toLowerCase().includes("far")) {
      responseText = "Your permissible Floor Area Ratio (FAR) depends on your zoning category. Commercial sectors permit a maximum FAR of 3.0, Residential sectors permit 2.5, and Mixed-Use sectors permit 2.8. Exceeding this will cause a critical violation and trigger automatic rejection.";
    } else {
      responseText = `I have received your query: "${userMessage}". For this project (${projectContext?.name || 'New Project'} in ${projectContext?.location || 'Smart City'}), municipal rules govern height limits of up to ${projectContext?.buildingType === "Commercial" ? "50" : "15"}m and setbacks. Make sure your design aligns with these zoning restrictions! What specific rule or section would you like me to analyze next?`;
    }

    res.json({ text: responseText });
  }
});

// Sarvam Speech API - Text to Speech Route
app.post("/api/voice/tts", async (req, res) => {
  const { text, selectedLang } = req.body;
  if (!text) return res.status(400).json({ error: "Text is required" });

  const sarvamKey = process.env.SARVAM_API_KEY || "sk_va3gsrtt_tGDismwrZhE6QHahylV6TX0q";

  // Map selectedLang to target_language_code and speaker for Sarvam bulbul:v1
  const langMappings: Record<string, string> = {
    "Hindi": "hi-IN",
    "Tamil": "ta-IN",
    "Telugu": "te-IN",
    "Kannada": "kn-IN",
    "Malayalam": "ml-IN",
    "Marathi": "mr-IN",
    "Gujarati": "gu-IN",
    "Bengali": "bn-IN",
    "Odia": "or-IN",
    "Punjabi": "pa-IN",
    "Assamese": "as-IN"
  };

  const speakerMappings: Record<string, string> = {
    "hi-IN": "meera",
    "ta-IN": "pavithra",
    "te-IN": "nisha",
    "kn-IN": "pavithra",
    "ml-IN": "pavithra",
    "mr-IN": "meera",
    "gu-IN": "meera",
    "bn-IN": "meera",
    "or-IN": "meera",
    "pa-IN": "meera",
    "as-IN": "meera",
    "en-IN": "meera"
  };

  const targetLanguage = selectedLang || "Hindi";
  const targetLangCode = langMappings[targetLanguage] || "hi-IN";
  const speaker = speakerMappings[targetLangCode] || "meera";

  if (sarvamKey) {
    try {
      console.log(`Generating TTS using Sarvam AI for text in ${targetLanguage} (${targetLangCode}), speaker: ${speaker}...`);
      const response = await fetch("https://api.sarvam.ai/v1/tts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-subscription-key": sarvamKey
        },
        body: JSON.stringify({
          inputs: [text],
          target_language_code: targetLangCode,
          speaker: speaker,
          pitch: 0,
          pace: 1.0,
          loudness: 1.5,
          model: "bulbul:v1"
        })
      });

      if (response.ok) {
        const data: any = await response.json();
        const base64Audio = data.audio_to_play || data.audioData;
        if (base64Audio) {
          console.log("Sarvam TTS generation successful!");
          return res.json({ audioData: base64Audio });
        }
      } else {
        const errorText = await response.text();
        console.error("Sarvam TTS API returned non-200 response:", response.status, errorText);
      }
    } catch (sarvamErr) {
      console.error("Sarvam TTS fetch failed:", sarvamErr);
    }
  }

  // Fallback to Gemini TTS
  if (ai) {
    try {
      console.log("Falling back to Gemini TTS...");
      const geminiResponse = await ai.models.generateContent({
        model: "gemini-3.1-flash-tts-preview",
        contents: [{ parts: [{ text: `Say clearly and helpful: ${text}` }] }],
        config: {
          responseModalities: ["AUDIO"],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: "Kore" }
            }
          }
        }
      });

      const base64Audio = geminiResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        console.log("Gemini TTS fallback successful!");
        return res.json({ audioData: base64Audio });
      }
    } catch (geminiErr) {
      console.error("Gemini TTS Error:", geminiErr);
    }
  }

  return res.json({ audioData: "fallback_mock_base64_audio" });
});

// Multilingual - Sarvam Translate API
app.post("/api/translation", async (req, res) => {
  const { text, targetLanguage } = req.body;
  if (!text) return res.status(400).json({ error: "Text is required" });
  if (!targetLanguage || targetLanguage === "English") {
    return res.json({ translatedText: text });
  }

  const sarvamKey = process.env.SARVAM_API_KEY || "sk_va3gsrtt_tGDismwrZhE6QHahylV6TX0q";
  
  // Language Mapping
  const langMappings: Record<string, string> = {
    "Hindi": "hi-IN",
    "Tamil": "ta-IN",
    "Telugu": "te-IN",
    "Kannada": "kn-IN",
    "Malayalam": "ml-IN",
    "Marathi": "mr-IN",
    "Gujarati": "gu-IN",
    "Bengali": "bn-IN",
    "Odia": "or-IN",
    "Punjabi": "pa-IN",
    "Assamese": "as-IN"
  };

  const targetLangCode = langMappings[targetLanguage] || "hi-IN";

  if (sarvamKey) {
    try {
      console.log(`Translating text to ${targetLanguage} (${targetLangCode}) using Sarvam AI...`);
      const response = await fetch("https://api.sarvam.ai/v1/translation/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-subscription-key": sarvamKey
        },
        body: JSON.stringify({
          input: text,
          source_language_code: "en-IN",
          target_language_code: targetLangCode
        })
      });

      if (response.ok) {
        const data: any = await response.json();
        const translatedText = data.translated_text || data.translatedText || (data.translations && data.translations[0]);
        if (translatedText) {
          console.log("Sarvam Translation successful!");
          return res.json({ translatedText });
        }
      } else {
        const errorText = await response.text();
        console.error("Sarvam Translation API returned non-200 response:", response.status, errorText);
      }
    } catch (sarvamErr) {
      console.error("Sarvam Translation fetch failed:", sarvamErr);
    }
  }

  // Fallback to Gemini Translation if Sarvam fails or is unavailable
  if (ai) {
    try {
      console.log("Falling back to Gemini translation...");
      const prompt = `
        Translate the following single phrase or text block into ${targetLanguage}.
        Only return the translated string itself, with absolutely no preamble, explanation, or quotes.
        
        Text to translate:
        "${text}"
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
      });

      return res.json({ translatedText: response.text?.trim() || text });
    } catch (geminiErr) {
      console.error("Gemini Translation Error:", geminiErr);
    }
  }

  // Fallback to offline dictionary of terms
  const dicts: Record<string, Record<string, string>> = {
    "Hindi": {
      "PermitFlow": "परमिटफ्लो",
      "The Construction Compliance Autopilot": "निर्माण अनुपालन ऑटोपायलट",
      "Compliance Score": "अनुपालन स्कोर",
      "Blueprint Analysis": "ब्लूप्रिंट विश्लेषण",
      "Zoning Rules": "ज़ोनिंग नियम",
      "Fire Safety": "अग्निशमन सुरक्षा",
      "Zoning": "ज़ोनिंग",
      "BuildingCode": "भवन संहिता",
      "Approved": "स्वीकृत",
      "Pending": "लंबित",
      "Rejected": "अस्वीकृत",
      "Start Project": "परियोजना शुरू करें",
      "Violation": "उल्लंघन"
    },
    "Tamil": {
      "PermitFlow": "பெர்மிட்ஃப்ளோ",
      "The Construction Compliance Autopilot": "கட்டுமான இணக்க ஆட்டோபைலட்",
      "Compliance Score": "இணக்க மதிப்பெண்",
      "Zoning Rules": "மண்டல விதிகள்",
      "Approved": "அங்கீகரிக்கப்பட்டது",
      "Pending": "நிலுவையில் உள்ளது",
      "Rejected": "நிராகரிக்கப்பட்டது",
      "Violation": "மீறல்"
    }
  };

  let fallbackTrans = text;
  if (dicts[targetLanguage] && dicts[targetLanguage][text]) {
    fallbackTrans = dicts[targetLanguage][text];
  } else {
    fallbackTrans = `[${targetLanguage}] ${text}`;
  }
  return res.json({ translatedText: fallbackTrans });
});

// Aggregate Analytics Endpoint
app.get("/api/analytics", (req, res) => {
  const approved = projects.filter(p => p.status === "Approved" || p.status === "Completed").length;
  const submitted = projects.filter(p => p.status === "Submitted" || p.status === "Under Review" || p.status === "Document Verification").length;
  const rejected = projects.filter(p => p.status === "Rejected").length;
  const draft = projects.filter(p => p.status === "Draft").length;

  const total = projects.length;
  const approvalRate = total > 0 ? Math.round(((approved) / (approved + rejected + submitted)) * 100) || 75 : 80;

  res.json({
    permitStatusCounts: [
      { name: "Draft", value: draft },
      { name: "Submitted", value: submitted },
      { name: "Approved", value: approved },
      { name: "Rejected", value: rejected }
    ],
    approvalRateHistory: [
      { month: "Feb", rate: 70 },
      { month: "Mar", rate: 74 },
      { month: "Apr", rate: 78 },
      { month: "May", rate: 82 },
      { month: "Jun", rate: 85 },
      { month: "Jul", rate: approvalRate }
    ],
    violationTypes: [
      { category: "Zoning (FAR)", count: 4 },
      { category: "Setbacks", count: 6 },
      { category: "Fire Safety", count: 3 },
      { category: "Parking Size", count: 2 },
      { category: "Environmental", count: 1 }
    ],
    averageApprovalTime: [
      { category: "Residential", days: 12 },
      { category: "Commercial", days: 38 },
      { category: "Mixed Use", days: 25 },
      { category: "Industrial", days: 55 }
    ],
    projectsPerMonth: [
      { month: "Feb", projects: 3 },
      { month: "Mar", projects: 5 },
      { month: "Apr", projects: 4 },
      { month: "May", projects: 8 },
      { month: "Jun", projects: 12 },
      { month: "Jul", projects: total }
    ]
  });
});

// --- VITE DEV SERVER OR STATIC SERVING IN PRODUCTION ---

const startServer = async () => {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting in Development Mode...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting in Production Mode...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`PermitFlow Full-Stack Server running on http://0.0.0.0:${PORT}`);
  });
};

startServer();
