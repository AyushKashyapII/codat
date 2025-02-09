import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
export async function GET(req: NextRequest, { params }:  { params: Promise<{codatId: string}>}) {
  try {
    const { codatId } = await params

    const codat = await db.codat.findUnique({
      where: { codatId: codatId },
    })

    if (!codat) {
      return NextResponse.json({ error: "Codat not found" }, { status: 404 })
    }

    const fileContent = codat.codatAIFunc

    const fileName = `codat_${codat.codatName}.${getFileExtension(codat.codatLanguage)}`

    return new NextResponse(fileContent, {
      status: 200,
      headers: {
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Content-Type": "text/plain",
      },
    })
  } catch (error) {
    console.error("Error downloading Codat:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

const getFileExtension = (language: string) => {
  const extensions: Record<string, string> = {
    javascript: "js",
    typescript: "ts",
    python: "py",
    java: "java",
    cpp: "cpp",
    c: "c",
    go: "go",
    rust: "rs",
  }
  return extensions[language.toLowerCase()] || "txt"
}
