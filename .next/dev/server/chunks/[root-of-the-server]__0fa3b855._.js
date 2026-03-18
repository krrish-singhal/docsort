module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/src/lib/db.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "connectToDatabase",
    ()=>connectToDatabase,
    "isMongoConnectivityError",
    ()=>isMongoConnectivityError
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs, [project]/node_modules/mongoose)");
;
const globalForMongoose = globalThis;
const cached = globalForMongoose.__mongooseConn ?? {
    conn: null,
    promise: null
};
globalForMongoose.__mongooseConn = cached;
function isMongoConnectivityError(error) {
    if (!error || typeof error !== 'object') return false;
    const name = 'name' in error ? error.name : undefined;
    return name === 'MongooseServerSelectionError' || name === 'MongoServerSelectionError' || name === 'MongoNetworkError';
}
async function connectToDatabase() {
    if (cached.conn) return cached.conn;
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        throw new Error('MONGODB_URI is not set');
    }
    if (!cached.promise) {
        cached.promise = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].connect(uri, {
            bufferCommands: false,
            serverSelectionTimeoutMS: 5_000,
            connectTimeoutMS: 5_000,
            socketTimeoutMS: 10_000
        });
    }
    try {
        cached.conn = await cached.promise;
        return cached.conn;
    } catch (error) {
        cached.promise = null;
        cached.conn = null;
        throw error;
    }
}
}),
"[externals]/node:buffer [external] (node:buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:buffer", () => require("node:buffer"));

module.exports = mod;
}),
"[externals]/node:crypto [external] (node:crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:crypto", () => require("node:crypto"));

module.exports = mod;
}),
"[externals]/node:util [external] (node:util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:util", () => require("node:util"));

module.exports = mod;
}),
"[project]/src/lib/auth.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getBearerToken",
    ()=>getBearerToken,
    "signAccessToken",
    ()=>signAccessToken,
    "verifyAccessToken",
    ()=>verifyAccessToken
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$jwt$2f$sign$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/node/esm/jwt/sign.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$jwt$2f$verify$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/node/esm/jwt/verify.js [app-route] (ecmascript)");
;
const encoder = new TextEncoder();
function getJwtSecret() {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET is not set');
    }
    return encoder.encode(secret);
}
async function signAccessToken(payload) {
    return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$jwt$2f$sign$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SignJWT"](payload).setProtectedHeader({
        alg: 'HS256'
    }).setIssuedAt().setExpirationTime('1h').sign(getJwtSecret());
}
async function verifyAccessToken(token) {
    const { payload } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$jwt$2f$verify$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jwtVerify"])(token, getJwtSecret());
    const sub = payload.sub;
    const email = payload.email;
    const name = payload.name;
    if (typeof sub !== 'string' || typeof email !== 'string' || typeof name !== 'string') {
        throw new Error('Invalid token payload');
    }
    return {
        sub,
        email,
        name
    };
}
function getBearerToken(req) {
    const header = req.headers.get('authorization');
    if (!header) return null;
    const [scheme, token] = header.split(' ');
    if (scheme?.toLowerCase() !== 'bearer' || !token) return null;
    return token;
}
}),
"[project]/src/lib/requestAuth.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "requireAuth",
    ()=>requireAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/auth.ts [app-route] (ecmascript)");
;
async function requireAuth(req) {
    const token = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getBearerToken"])(req) ?? req.cookies.get('docsort_token')?.value ?? null;
    if (!token) {
        throw new Error('UNAUTHORIZED');
    }
    const payload = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["verifyAccessToken"])(token);
    return {
        id: payload.sub,
        email: payload.email,
        name: payload.name
    };
}
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/querystring [external] (querystring, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("querystring", () => require("querystring"));

module.exports = mod;
}),
"[externals]/url [external] (url, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[externals]/https [external] (https, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("https", () => require("https"));

module.exports = mod;
}),
"[externals]/http [external] (http, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http", () => require("http"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[project]/src/lib/cloudinary.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cloudinaryPublicIdFromSecureUrl",
    ()=>cloudinaryPublicIdFromSecureUrl,
    "getCloudinary",
    ()=>getCloudinary
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cloudinary$2f$cloudinary$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/cloudinary/cloudinary.js [app-route] (ecmascript)");
;
let configured = false;
function getCloudinary() {
    if (!configured) {
        const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
        const apiKey = process.env.CLOUDINARY_API_KEY;
        const apiSecret = process.env.CLOUDINARY_API_SECRET;
        if (!cloudName || !apiKey || !apiSecret) {
            throw new Error('Cloudinary env vars are not set');
        }
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cloudinary$2f$cloudinary$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["v2"].config({
            cloud_name: cloudName,
            api_key: apiKey,
            api_secret: apiSecret,
            secure: true
        });
        configured = true;
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cloudinary$2f$cloudinary$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["v2"];
}
function cloudinaryPublicIdFromSecureUrl(url) {
    // Cloudinary secure URLs typically: https://res.cloudinary.com/<cloud>/.../upload/v123/folder/file.ext
    // We store public_id explicitly in DB; this helper is best-effort fallback.
    try {
        const parsed = new URL(url);
        const parts = parsed.pathname.split('/');
        const uploadIndex = parts.findIndex((p)=>p === 'upload');
        if (uploadIndex === -1) return null;
        const afterUpload = parts.slice(uploadIndex + 1);
        const withoutVersion = afterUpload[0]?.startsWith('v') ? afterUpload.slice(1) : afterUpload;
        const joined = withoutVersion.join('/');
        const dot = joined.lastIndexOf('.');
        return dot > 0 ? joined.slice(0, dot) : joined;
    } catch  {
        return null;
    }
}
}),
"[project]/src/models/File.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FileModel",
    ()=>FileModel
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs, [project]/node_modules/mongoose)");
;
const FileSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["Schema"]({
    userId: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["Schema"].Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    fileName: {
        type: String,
        required: true,
        trim: true
    },
    fileUrl: {
        type: String,
        required: true
    },
    cloudinaryPublicId: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    uploadedAt: {
        type: Date,
        default: Date.now,
        index: true
    },
    mimeType: {
        type: String
    },
    size: {
        type: Number
    }
}, {
    versionKey: false
});
FileSchema.index({
    userId: 1,
    category: 1,
    uploadedAt: -1
});
const FileModel = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].models.File || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].model('File', FileSchema);
}),
"[project]/src/lib/categories.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CATEGORIES",
    ()=>CATEGORIES,
    "isCategory",
    ()=>isCategory
]);
const CATEGORIES = [
    'Invoices',
    'Finance',
    'Medical Reports',
    'Legal',
    'Academic',
    'Receipts',
    'Personal Documents',
    'Others'
];
function isCategory(value) {
    return typeof value === 'string' && CATEGORIES.includes(value);
}
}),
"[project]/lib/services/extractors/pdfExtractor.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "extractTextFromPDF",
    ()=>extractTextFromPDF
]);
async function extractTextFromPDF(buffer) {
    try {
        const pdf = await __turbopack_context__.A("[project]/node_modules/pdf-parse/index.js [app-route] (ecmascript, async loader)");
        const data = await pdf.default(buffer);
        if (data.text && data.text.trim().length > 0) {
            return {
                text: data.text,
                extractedFrom: 'text'
            };
        }
        // Fallback to OCR if PDF parsing yields no text
        console.log('[v0] PDF text extraction returned empty, would need OCR fallback');
        return {
            text: '',
            extractedFrom: 'text'
        };
    } catch (error) {
        console.error('[v0] Error extracting PDF:', error);
        throw new Error(`Failed to extract text from PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}
}),
"[project]/lib/services/extractors/docxExtractor.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "extractTextFromDOCX",
    ()=>extractTextFromDOCX
]);
async function extractTextFromDOCX(buffer) {
    try {
        const mammoth = await __turbopack_context__.A("[project]/node_modules/mammoth/lib/index.js [app-route] (ecmascript, async loader)");
        const result = await mammoth.extractRawText({
            buffer
        });
        return {
            text: result.value,
            extractedFrom: 'text'
        };
    } catch (error) {
        console.error('[v0] Error extracting DOCX:', error);
        throw new Error(`Failed to extract text from DOCX: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}
}),
"[project]/lib/services/extractors/index.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "extractText",
    ()=>extractText
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$services$2f$extractors$2f$pdfExtractor$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/services/extractors/pdfExtractor.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$services$2f$extractors$2f$docxExtractor$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/services/extractors/docxExtractor.ts [app-route] (ecmascript)");
;
;
async function extractText(buffer, mimeType, filename) {
    // Route to appropriate extractor based on file type
    if (mimeType === 'application/pdf' || filename.toLowerCase().endsWith('.pdf')) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$services$2f$extractors$2f$pdfExtractor$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["extractTextFromPDF"])(buffer);
    }
    if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || filename.toLowerCase().endsWith('.docx')) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$services$2f$extractors$2f$docxExtractor$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["extractTextFromDOCX"])(buffer);
    }
    // Plain text files
    if (mimeType.startsWith('text/') || filename.toLowerCase().endsWith('.txt')) {
        return {
            text: buffer.toString('utf-8'),
            extractedFrom: 'text'
        };
    }
    throw new Error(`Unsupported file type: ${mimeType}`);
}
}),
"[project]/lib/services/classifier/ruleClassifier.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "classifyByRules",
    ()=>classifyByRules
]);
const RULE_PATTERNS = {
    Documents: {
        keywords: [
            "document",
            "form",
            "application",
            "report"
        ],
        patterns: []
    },
    Invoices: {
        keywords: [
            "invoice",
            "tax invoice",
            "invoice number",
            "invoice no",
            "invoice date",
            "amount due",
            "bill to",
            "ship to",
            "subtotal",
            "total amount",
            "gstin",
            "hsn"
        ],
        patterns: [
            /tax\s*invoice/i,
            /invoice\s*(number|no\.?|#)\s*[:\-]?\s*[\w\-]+/i,
            /bill\s*to\s*[:\-]/i,
            /amount\s*due\s*[:\-]?/i,
            /due\s*date/i,
            /gstin\s*[:\-]?\s*[0-9A-Z]{10,}/i,
            /total\s*[:\-]?\s*(?:₹|rs\.?|inr|\$)?\s*[\d,.]+/i
        ]
    },
    Finance: {
        keywords: [
            "bank",
            "account",
            "statement",
            "balance",
            "transaction",
            "deposit",
            "withdrawal",
            "spreadsheet",
            // receipt-like documents are treated as finance
            "receipt",
            "purchase",
            "store",
            "retail",
            "price",
            "item",
            "qty"
        ],
        patterns: [
            /bank\s*statement/i,
            /account\s*statement/i,
            /closing\s*balance/i,
            /debit|credit/i
        ]
    },
    Receipts: {
        keywords: [
            "receipt",
            "cash memo",
            "tax receipt",
            "pos",
            "terminal",
            "merchant",
            "thank you for shopping",
            "subtotal",
            "total",
            "qty",
            "quantity",
            "change",
            "cash",
            "card",
            "upi",
            "txn",
            "transaction id",
            "gst"
        ],
        patterns: [
            /\b(receipt|cash\s*memo)\b/i,
            /thank\s+you\s+for\s+shopping/i,
            /\bqty\b\s*[:\-]?\s*\d+/i,
            /\btotal\b\s*[:\-]?\s*(?:₹|rs\.?|inr|\$)?\s*[\d,.]+/i,
            /\bupi\b/i,
            /\btxn\b\s*(id|no\.?|#)?/i,
            /\bmerchant\b/i
        ]
    },
    "Medical Reports": {
        keywords: [
            "medical",
            "medical report",
            "medical certificate",
            "fitness certificate",
            "patient",
            "diagnosis",
            "doctor",
            "dr.",
            "hospital",
            "clinic",
            "prescription",
            "clinical",
            "health"
        ],
        patterns: [
            /medical\s*certificate/i,
            /fitness\s*certificate/i,
            /fit\s*to\s*work/i,
            /unfit\s*to\s*work/i,
            /patient\s*name/i,
            /diagnosis/i,
            /prescription/i,
            /dr\.?\s*[A-Z][a-z]+/
        ]
    },
    Legal: {
        keywords: [
            "legal",
            "clause",
            "attorney",
            "law",
            "court",
            "defendant",
            "plaintiff",
            // contract / agreement-style docs (previously a separate "Agreements" category)
            "agreement",
            "contract",
            "terms and conditions",
            "terms & conditions",
            "party",
            "parties",
            "effective date",
            "governing law",
            "whereas",
            "hereby",
            "witnesseth",
            "indemnity",
            "confidentiality",
            "non disclosure",
            "non-disclosure",
            "nda",
            "service agreement",
            "employment agreement",
            "lease agreement",
            "rental agreement"
        ],
        patterns: [
            /legal\s*notice/i,
            /court\s*order/i,
            /case\s*no\.?/i,
            /\bagreement\b/i,
            /\bcontract\b/i,
            /terms\s*(and|&)\s*conditions/i,
            /effective\s*date\s*[:\-]?/i,
            /governing\s*law/i,
            /\bwhereas\b/i,
            /\bhereby\b/i,
            /\bwitnesseth\b/i,
            /confidentiality/i,
            /non\s*-?disclosure/i,
            /\bnda\b/i,
            /indemnif(y|ication)/i
        ]
    },
    Academic: {
        keywords: [
            "student",
            "university",
            "college",
            "school",
            "degree",
            "grade",
            "course",
            "exam",
            "transcript"
        ],
        patterns: [
            /university|college|school/i,
            /grade|marksheet|mark\s*sheet|transcript/i,
            /course\s*completion\s*certificate/i,
            /semester|credits/i,
            /degree/i
        ]
    },
    Personal: {
        keywords: [
            "passport",
            "driver",
            "driving",
            "license",
            "birth certificate",
            "marriage certificate",
            "personal id",
            "aadhaar",
            "aadhar",
            "pan card"
        ],
        patterns: [
            /passport/i,
            /driver.*license|driving\s*licen[sc]e/i,
            /birth\s*certificate/i,
            /marriage\s*certificate/i,
            /aadha[ar]\s*(number|no\.?)/i,
            /pan\s*(number|no\.?|card)/i,
            /personal\s*id/i
        ]
    },
    "Personal Documents": {
        keywords: [
            "passport",
            "driver",
            "driving",
            "license",
            "birth certificate",
            "marriage certificate",
            "personal id",
            "aadhaar",
            "aadhar",
            "pan card",
            "voter",
            "national id"
        ],
        patterns: [
            /passport/i,
            /driver.*license|driving\s*licen[sc]e/i,
            /birth\s*certificate/i,
            /marriage\s*certificate/i,
            /aadha[ar]\s*(number|no\.?)/i,
            /pan\s*(number|no\.?|card)/i,
            /voter\s*(id|card)/i,
            /national\s*id/i,
            /personal\s*id/i
        ]
    }
};
function escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function normalizeText(value) {
    return value.replace(/\0/g, "").replace(/[_\-]+/g, " ").toLowerCase();
}
function quickDetectCategory(text) {
    // High-signal overrides to prevent generic “certificate” matches.
    if (/medical\s*certificate/i.test(text) || /fit\s*to\s*work/i.test(text) || /unfit\s*to\s*work/i.test(text)) {
        return "Medical Reports";
    }
    if (/tax\s*invoice/i.test(text) || /invoice\s*(number|no\.?|#)/i.test(text) || /\binvoice\b/i.test(text) || /gstin/i.test(text)) {
        return "Invoices";
    }
    if (/(\breceipt\b|cash\s*memo|thank\s+you\s+for\s+shopping)/i.test(text)) {
        return "Receipts";
    }
    return null;
}
function classifyByRules(text) {
    const truncatedText = normalizeText(text.slice(0, 4000));
    const quick = quickDetectCategory(truncatedText);
    if (quick) {
        return {
            category: quick,
            confidence: 0.92,
            mode: "rule-based",
            reasoning: `Quick-detected ${quick} from high-signal patterns`
        };
    }
    let bestMatch = null;
    // Score each category
    for (const [category, rules] of Object.entries(RULE_PATTERNS)){
        if (!rules) continue;
        let score = 0;
        // Check keywords
        for (const keyword of rules.keywords){
            const count = (truncatedText.match(new RegExp(escapeRegExp(keyword.toLowerCase()), "g")) || []).length;
            score += count * 1;
        }
        // Check patterns (higher weight)
        for (const pattern of rules.patterns){
            const matches = (truncatedText.match(pattern) || []).length;
            score += matches * 3;
        }
        // Update best match
        if (score > (bestMatch?.score ?? 0)) {
            bestMatch = {
                category: category,
                score
            };
        }
    }
    // Only return rule-based classification if confidence is high enough
    if (bestMatch && bestMatch.score >= 4) {
        return {
            category: bestMatch.category,
            confidence: Math.min(bestMatch.score / 10, 0.95),
            mode: "rule-based",
            reasoning: `Matched ${bestMatch.category} rules with score ${bestMatch.score.toFixed(1)}`
        };
    }
    return null;
}
}),
"[externals]/punycode [external] (punycode, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("punycode", () => require("punycode"));

module.exports = mod;
}),
"[externals]/zlib [external] (zlib, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}),
"[externals]/util [external] (util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}),
"[externals]/node:fs [external] (node:fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:fs", () => require("node:fs"));

module.exports = mod;
}),
"[externals]/node:stream [external] (node:stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:stream", () => require("node:stream"));

module.exports = mod;
}),
"[externals]/node:stream/web [external] (node:stream/web, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:stream/web", () => require("node:stream/web"));

module.exports = mod;
}),
"[project]/lib/services/classifier/aiClassifier.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "classifyWithAI",
    ()=>classifyWithAI
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$groq$2d$sdk$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/groq-sdk/index.mjs [app-route] (ecmascript) <locals>");
;
const CLASSIFICATION_PROMPT = `You are a document classification expert.

Classify the provided document into exactly one of these categories:
- Documents
- Invoices
- Finance
- Medical Reports
- Legal
- Academic
- Personal
- Others

Return STRICT JSON ONLY (no markdown, no extra text) in this format:
{"category":"<one of the categories>","confidence":0.0,"reasoning":"short reason"}

Rules:
- confidence must be a number between 0 and 1
- If the text is too short/noisy or ambiguous, choose "Others" with confidence <= 0.55
- Prefer "Invoices" for invoice-number/tax-invoice documents; prefer "Finance" for bank statements and receipts
- Prefer "Legal" for contracts/terms/clauses/parties/effective-date/governing-law style documents`;
const VALID_CATEGORIES = [
    'Documents',
    'Invoices',
    'Finance',
    'Medical Reports',
    'Legal',
    'Academic',
    'Personal',
    'Others'
];
function clampConfidence(value) {
    const num = typeof value === 'number' ? value : Number.NaN;
    if (!Number.isFinite(num)) return 0.5;
    return Math.max(0, Math.min(1, num));
}
function normalizeCategory(value) {
    if (typeof value !== 'string') return 'Others';
    const lower = value.trim().toLowerCase();
    const exact = VALID_CATEGORIES.find((c)=>c.toLowerCase() === lower);
    if (exact) return exact;
    // Common synonyms
    if (lower.includes('receipt')) return 'Finance';
    if (lower.includes('invoice')) return 'Invoices';
    if (lower.includes('document') || lower.includes('general')) return 'Documents';
    if (lower.includes('medical')) return 'Medical Reports';
    if (lower.includes('agreement') || lower.includes('contract') || lower.includes('nda')) return 'Legal';
    if (lower.includes('legal') || lower.includes('court')) return 'Legal';
    if (lower.includes('academic') || lower.includes('university') || lower.includes('transcript')) return 'Academic';
    if (lower.includes('personal')) return 'Personal';
    if (lower.includes('other') || lower.includes('unknown') || lower.includes('unclear')) return 'Others';
    return 'Others';
}
function parseAiJson(responseTextRaw) {
    const raw = responseTextRaw.trim();
    // Try direct JSON first
    try {
        const parsed = JSON.parse(raw);
        return {
            category: normalizeCategory(parsed?.category),
            confidence: clampConfidence(parsed?.confidence),
            reasoning: typeof parsed?.reasoning === 'string' ? parsed.reasoning : undefined
        };
    } catch  {
        // Try to extract a JSON object substring
        const match = raw.match(/\{[\s\S]*\}/);
        if (match) {
            try {
                const parsed = JSON.parse(match[0]);
                return {
                    category: normalizeCategory(parsed?.category),
                    confidence: clampConfidence(parsed?.confidence),
                    reasoning: typeof parsed?.reasoning === 'string' ? parsed.reasoning : undefined
                };
            } catch  {
            // fall through
            }
        }
    }
    // Last resort heuristic
    return {
        category: normalizeCategory(raw),
        confidence: 0.5,
        reasoning: 'Non-JSON AI response; normalized heuristically'
    };
}
async function classifyWithAI(text) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
        throw new Error('GROQ_API_KEY environment variable is not set');
    }
    try {
        const client = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$groq$2d$sdk$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"]({
            apiKey
        });
        // Truncate text to avoid exceeding token limits
        const truncatedText = text.slice(0, 5000);
        const completion = await client.chat.completions.create({
            model: 'mixtral-8x7b-32768',
            max_tokens: 160,
            temperature: 0,
            messages: [
                {
                    role: 'user',
                    content: `${CLASSIFICATION_PROMPT}\n\nDocument text:\n${truncatedText}`
                }
            ]
        });
        const responseText = completion.choices?.[0]?.message?.content?.trim() ?? '';
        const parsed = parseAiJson(responseText);
        const category = parsed.confidence <= 0.55 ? 'Others' : parsed.category;
        const confidence = clampConfidence(parsed.confidence);
        return {
            category,
            confidence,
            mode: 'ai',
            reasoning: parsed.reasoning ?? `Groq classified as ${category}`
        };
    } catch (error) {
        console.error('[v0] Error calling Groq API:', error);
        throw new Error(`Failed to classify with AI: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}
}),
"[project]/lib/services/classifier/index.ts [app-route] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "classifyDocument",
    ()=>classifyDocument
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$services$2f$classifier$2f$ruleClassifier$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/services/classifier/ruleClassifier.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$services$2f$classifier$2f$aiClassifier$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/services/classifier/aiClassifier.ts [app-route] (ecmascript)");
;
;
async function classifyDocument(text) {
    // Try rule-based classification first for speed
    const ruleResult = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$services$2f$classifier$2f$ruleClassifier$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["classifyByRules"])(text);
    if (ruleResult) {
        console.log("[v0] Using rule-based classification");
        return ruleResult;
    }
    // Fall back to AI classification
    console.log("[v0] Using AI-based classification with Groq");
    try {
        return await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$services$2f$classifier$2f$aiClassifier$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["classifyWithAI"])(text);
    } catch (error) {
        console.error("[v0] AI classification failed, defaulting to Others:", error);
        // Fallback to Others category if AI fails
        return {
            category: "Others",
            confidence: 0.5,
            mode: "rule-based",
            reasoning: "Default fallback due to classification error"
        };
    }
}
;
}),
"[project]/app/api/files/upload/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST,
    "runtime",
    ()=>runtime
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/db.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$requestAuth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/requestAuth.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cloudinary$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/cloudinary.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$File$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/models/File.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$categories$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/categories.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$services$2f$extractors$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/services/extractors/index.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$services$2f$classifier$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/services/classifier/index.ts [app-route] (ecmascript) <locals>");
;
;
;
;
;
;
;
;
const runtime = 'nodejs';
async function POST(req) {
    try {
        const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$requestAuth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["requireAuth"])(req);
        const formData = await req.formData();
        const file = formData.get('file');
        if (!(file instanceof File)) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: 'No file provided'
            }, {
                status: 400
            });
        }
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        // Extract + classify for best accuracy
        let extractedText = '';
        try {
            const extraction = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$services$2f$extractors$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["extractText"])(buffer, file.type, file.name);
            extractedText = extraction.text;
        } catch (error) {
            console.error('[files/upload] text extraction failed', error);
        }
        const classificationInput = [
            file.name,
            extractedText
        ].filter(Boolean).join('\n\n');
        const classification = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$services$2f$classifier$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["classifyDocument"])(classificationInput);
        const mappedCategory = mapClassifierCategoryToApiCategory(classification.category);
        const category = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$categories$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isCategory"])(mappedCategory) ? mappedCategory : 'Others';
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["connectToDatabase"])();
        const cloud = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cloudinary$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getCloudinary"])();
        const uploadResult = await new Promise((resolve, reject)=>{
            const stream = cloud.uploader.upload_stream({
                folder: `uploads/${user.id}/${category}`,
                resource_type: 'auto',
                use_filename: true,
                unique_filename: true
            }, (error, result)=>{
                if (error || !result) return reject(error ?? new Error('Cloudinary upload failed'));
                resolve({
                    secure_url: result.secure_url,
                    public_id: result.public_id
                });
            });
            stream.end(buffer);
        });
        const doc = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$File$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["FileModel"].create({
            userId: user.id,
            fileName: file.name,
            fileUrl: uploadResult.secure_url,
            cloudinaryPublicId: uploadResult.public_id,
            category,
            uploadedAt: new Date(),
            mimeType: file.type || undefined,
            size: file.size
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            file: {
                id: doc._id.toString(),
                fileName: doc.fileName,
                fileUrl: doc.fileUrl,
                category: doc.category,
                uploadedAt: doc.uploadedAt,
                confidence: classification.confidence,
                mode: classification.mode
            }
        }, {
            status: 201
        });
    } catch (error) {
        if (error instanceof Error && error.message === 'UNAUTHORIZED') {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: 'Unauthorized'
            }, {
                status: 401
            });
        }
        console.error('[files/upload] error', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: 'Internal server error'
        }, {
            status: 500
        });
    }
}
function mapClassifierCategoryToApiCategory(category) {
    switch(category){
        case 'Invoices':
            return 'Invoices';
        case 'Finance':
            return 'Finance';
        case 'Receipts':
            return 'Receipts';
        case 'Medical Reports':
            return 'Medical Reports';
        case 'Agreements':
            return 'Legal';
        case 'Legal':
            return 'Legal';
        case 'Academic':
            return 'Academic';
        case 'Personal Documents':
            return 'Personal Documents';
        case 'Personal':
            return 'Personal Documents';
        case 'Others':
            return 'Others';
        case 'Documents':
            return 'Others';
        default:
            return 'Others';
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0fa3b855._.js.map