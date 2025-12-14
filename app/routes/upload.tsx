import { type FormEvent, useState } from "react";
import Navbar from "~/components/Navbar";
import FileUploader from "~/components/FileUploader";
import { usePuterStore } from "~/lib/puter";
import { useNavigate } from "react-router";
import { convertPdfToImage } from "~/lib/pdf2img";
import { generateUUID } from "~/lib/utils";
import { prepareInstructions } from "../../constants";

export const meta = () => [
  { title: "SkillSync | Upload" },
  { name: "description", content: "Upload your resume" },
];

const Upload = () => {
  const { auth, isLoading, fs, ai, kv } = usePuterStore();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleFileSelect = (file: File | null) => {
    setFile(file);
  };

  const handleAnalyze = async ({
    companyName,
    jobTitle,
    jobDescription,
    file,
  }: {
    companyName: string;
    jobTitle: string;
    jobDescription: string;
    file: File;
  }) => {
    setIsProcessing(true);

    setStatusText("Uploading the file...");
    const uploadedFile = await fs.upload([file]);
    if (!uploadedFile) return setStatusText("Error: Failed to upload file");

    setStatusText("Converting to image...");
    const imageFile = await convertPdfToImage(file);
    if (!imageFile.file)
      return setStatusText("Error: Failed to convert PDF to image");

    setStatusText("Uploading the image...");
    const uploadedImage = await fs.upload([imageFile.file]);
    if (!uploadedImage) return setStatusText("Error: Failed to upload image");

    setStatusText("Preparing data...");
    const uuid = generateUUID();
    const data = {
      id: uuid,
      resumePath: uploadedFile.path,
      imagePath: uploadedImage.path,
      companyName,
      jobTitle,
      jobDescription,
      feedback: "",
    };
    await kv.set(`resume:${uuid}`, JSON.stringify(data));

    setStatusText("Analyzing...");

    const feedback = await ai.feedback(
      uploadedFile.path,
      prepareInstructions({ jobTitle, jobDescription })
    );
    if (!feedback) return setStatusText("Error: Failed to analyze resume");

    const feedbackText =
      typeof feedback.message.content === "string"
        ? feedback.message.content
        : feedback.message.content[0].text;

    data.feedback = JSON.parse(feedbackText);
    await kv.set(`resume:${uuid}`, JSON.stringify(data));
    setStatusText("Analysis complete, redirecting...");
    console.log(data);
    navigate(`/resume/${uuid}`);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget.closest("form");
    if (!form) return;
    const formData = new FormData(form);

    const companyName = formData.get("company-name") as string;
    const jobTitle = formData.get("job-title") as string;
    const jobDescription = formData.get("job-description") as string;

    if (!file) return;

    handleAnalyze({ companyName, jobTitle, jobDescription, file });
  };

  const inputClasses =
    "block w-full rounded-lg border border-slate-300 bg-white p-3 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-sm";

  const labelClasses = "mb-2 block text-sm font-medium text-slate-700";

  return (
    <main className="min-h-screen w-full bg-white text-slate-900 font-sans selection:bg-indigo-100">
      <Navbar />

      <section className="mx-auto max-w-3xl px-4 py-16">
        <div className="flex flex-col items-center justify-center text-center">
          <h1 className="text-4xl font-extrabold text-slate-600 sm:text-5xl mb-4 tracking-tight">
            Smart feedback for your{" "}
            <span className="text-indigo-600">dream job</span>
          </h1>

          {isProcessing ? (
            <div className="mt-8 w-full max-w-xl flex flex-col items-center rounded-xl bg-white p-8 border border-slate-200 shadow-xl">
              <h2 className="text-xl font-semibold text-indigo-600 animate-pulse mb-6">
                {statusText}
              </h2>
              <div className="relative w-full flex items-center justify-center overflow-hidden rounded-lg">
                <img
                  src="/images/resume-scan.gif"
                  className="w-[200px] opacity-100 mix-blend-multiply"
                  alt="Scanning Resume"
                />
              </div>
            </div>
          ) : (
            <h2 className="text-lg text-slate-600 max-w-xl">
              Drop your resume below to receive an ATS score and personalized
              improvement tips.
            </h2>
          )}

          {!isProcessing && (
            <form
              id="upload-form"
              onSubmit={handleSubmit}
              className="mt-10 w-full rounded-2xl bg-white border border-slate-200 p-6 md:p-8 shadow-2xl shadow-slate-200/50"
            >
              <div className="flex flex-col gap-6 w-full">
                <div className="text-left w-full">
                  <label htmlFor="company-name" className={labelClasses}>
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="company-name"
                    placeholder="e.g. Google, Amazon..."
                    id="company-name"
                    className={inputClasses}
                  />
                </div>

                <div className="text-left w-full">
                  <label htmlFor="job-title" className={labelClasses}>
                    Job Title
                  </label>
                  <input
                    type="text"
                    name="job-title"
                    placeholder="e.g. Senior Frontend Engineer"
                    id="job-title"
                    className={inputClasses}
                  />
                </div>

                <div className="text-left w-full">
                  <label htmlFor="job-description" className={labelClasses}>
                    Job Description
                  </label>
                  <textarea
                    rows={5}
                    name="job-description"
                    placeholder="Paste the job description here..."
                    id="job-description"
                    className={inputClasses}
                  />
                </div>

                <div className="text-left w-full">
                  <label htmlFor="uploader" className={labelClasses}>
                    Upload Resume
                  </label>
                  <div className="w-full overflow-hidden rounded-lg border border-slate-300 bg-slate-50">
                    <FileUploader onFileSelect={handleFileSelect} />
                  </div>
                </div>

                <button
                  type="submit"
                  className="mt-4 w-full rounded-lg bg-indigo-600 px-6 py-4 text-lg font-bold text-white transition-all hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/25 active:scale-95 cursor-pointer"
                >
                  Analyze Resume
                </button>
              </div>
            </form>
          )}
        </div>
      </section>
    </main>
  );
};
export default Upload;
