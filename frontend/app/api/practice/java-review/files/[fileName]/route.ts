import { NextResponse } from "next/server";
import { getJavaReviewAssignmentFile } from "@/features/course-practice/content";

type JavaReviewFileRouteContext = Readonly<{
  params: Promise<{
    fileName: string;
  }>;
}>;

export async function GET(_request: Request, { params }: JavaReviewFileRouteContext) {
  const { fileName } = await params;
  const decodedFileName = decodeURIComponent(fileName);
  const file = getJavaReviewAssignmentFile(decodedFileName);

  if (!file) {
    return NextResponse.json({ message: "Java Review file was not found." }, { status: 404 });
  }

  return new Response(file.content, {
    headers: {
      "Cache-Control": "no-store",
      "Content-Disposition": `attachment; filename="${file.fileName}"`,
      "Content-Type": "text/x-java-source; charset=utf-8",
      "X-Content-Type-Options": "nosniff"
    }
  });
}
