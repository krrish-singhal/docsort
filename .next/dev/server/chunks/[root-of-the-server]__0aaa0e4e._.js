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
"[project]/src/models/File.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FileModel",
    ()=>FileModel
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs, [project]/node_modules/mongoose)");
;
const FileSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["Schema"]({
    // Either `userId` (signed-in uploads) or `guestId` (anonymous uploads) will be set.
    userId: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["Schema"].Types.ObjectId,
        ref: 'User',
        required: false,
        index: true
    },
    guestId: {
        type: String,
        required: false,
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
FileSchema.index({
    guestId: 1,
    category: 1,
    uploadedAt: -1
});
const FileModel = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].models.File || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].model('File', FileSchema);
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
"[project]/app/api/files/[id]/content/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "dynamic",
    ()=>dynamic,
    "runtime",
    ()=>runtime
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs, [project]/node_modules/mongoose)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/db.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$requestAuth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/requestAuth.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$File$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/models/File.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cloudinary$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/cloudinary.ts [app-route] (ecmascript)");
;
;
;
;
;
;
const runtime = 'nodejs';
const dynamic = 'force-dynamic';
function isValidObjectId(id) {
    return __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].Types.ObjectId.isValid(id);
}
function contentTypeForFilename(filename, fallback) {
    const lower = filename.toLowerCase();
    if (lower.endsWith('.pdf')) return 'application/pdf';
    if (lower.endsWith('.txt')) return 'text/plain; charset=utf-8';
    if (lower.endsWith('.docx')) {
        return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    }
    if (lower.endsWith('.doc')) return 'application/msword';
    return fallback && typeof fallback === 'string' ? fallback : 'application/octet-stream';
}
function dispositionForFilename(filename) {
    const lower = filename.toLowerCase();
    return lower.endsWith('.pdf') || lower.endsWith('.txt') ? 'inline' : 'attachment';
}
function extensionFromFilename(filename) {
    const base = filename.split('/').pop() ?? filename;
    const idx = base.lastIndexOf('.');
    if (idx <= 0 || idx === base.length - 1) return null;
    return base.slice(idx + 1).toLowerCase();
}
function parseCloudinaryResourceType(url) {
    if (!url) return 'raw';
    try {
        const parsed = new URL(url);
        const parts = parsed.pathname.split('/').filter(Boolean);
        const candidate = parts[1];
        if (candidate === 'image' || candidate === 'raw' || candidate === 'video') return candidate;
    } catch  {
    // ignore
    }
    return 'raw';
}
function parseCloudinaryType(url) {
    if (!url) return 'upload';
    try {
        const parsed = new URL(url);
        const parts = parsed.pathname.split('/').filter(Boolean);
        // format: /<cloud_name>/<resource_type>/<type>/...
        const candidate = parts[2];
        return candidate || 'upload';
    } catch  {
        return 'upload';
    }
}
async function GET(req, context) {
    try {
        const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$requestAuth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["requireAuth"])(req);
        const { id } = await context.params;
        if (!isValidObjectId(id)) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: 'Invalid id'
            }, {
                status: 400
            });
        }
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["connectToDatabase"])();
        const file = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$File$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["FileModel"].findById(id).select({
            userId: 1,
            fileName: 1,
            fileUrl: 1,
            cloudinaryPublicId: 1,
            mimeType: 1
        }).lean();
        if (!file) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: 'Not found'
            }, {
                status: 404
            });
        }
        if (!file.userId || file.userId.toString() !== user.id) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: 'Forbidden'
            }, {
                status: 403
            });
        }
        const resourceType = parseCloudinaryResourceType(file.fileUrl);
        const deliveryType = parseCloudinaryType(file.fileUrl);
        const cloud = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cloudinary$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getCloudinary"])();
        // Use signed delivery URL to support authenticated/private resources.
        // For public uploads, this still works fine.
        const signedUrl = cloud.url(file.cloudinaryPublicId, {
            secure: true,
            sign_url: true,
            resource_type: resourceType,
            type: deliveryType
        });
        const tryFetch = async (url)=>{
            // Cloudinary can respond differently based on headers; setting Accept helps PDFs.
            return fetch(url, {
                cache: 'no-store',
                headers: {
                    Accept: '*/*'
                }
            });
        };
        let upstream = await tryFetch(signedUrl);
        if ((!upstream.ok || !upstream.body) && file.fileUrl && file.fileUrl !== signedUrl) {
            upstream = await tryFetch(file.fileUrl);
        }
        // If delivery endpoints are protected (often 401/403), fall back to Cloudinary's signed download URL.
        if ((!upstream.ok || !upstream.body) && (upstream.status === 401 || upstream.status === 403)) {
            const format = extensionFromFilename(file.fileName) ?? 'bin';
            const privateDownloadUrl = cloud.utils.private_download_url(file.cloudinaryPublicId, format, {
                resource_type: resourceType,
                type: deliveryType,
                attachment: false
            });
            const third = await tryFetch(privateDownloadUrl);
            if (third.ok && third.body) {
                upstream = third;
            }
        }
        if (!upstream.ok || !upstream.body) {
            const status = upstream.status;
            const detail = `Upstream fetch failed (${status}).`;
            console.error('[api/files/:id/content] upstream fetch failed', {
                status,
                signedUrl,
                fileUrl: file.fileUrl
            });
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: 'Failed to fetch file content',
                detail
            }, {
                status: 502,
                headers: {
                    'Cache-Control': 'no-store'
                }
            });
        }
        const contentType = contentTypeForFilename(file.fileName, upstream.headers.get('content-type') ?? file.mimeType ?? null);
        const disposition = dispositionForFilename(file.fileName);
        const headers = new Headers();
        headers.set('Content-Type', contentType);
        headers.set('Content-Disposition', `${disposition}; filename*=UTF-8''${encodeURIComponent(file.fileName)}`);
        headers.set('Cache-Control', 'no-store');
        const len = upstream.headers.get('content-length');
        if (len) headers.set('Content-Length', len);
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"](upstream.body, {
            status: 200,
            headers
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
        console.error('[api/files/:id/content GET] error', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: 'Internal server error'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0aaa0e4e._.js.map