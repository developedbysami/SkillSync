import { type FormEvent, useState } from "react";

import Navbar from "~/components/Navbar";
import FileUploader from "~/components/FileUploader";
import { usePuterStore } from "~/lib/puter";
import { useNavigate } from "react-router";
import { convertPdfToImage } from "~/lib/pdf2img";
import { generateUUID } from "~/lib/utils";
import { prepareInstructions } from "../../constants";

export const meta = () => [
  { title: "Resumind | Upload" },
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

  // ---STYLING CONSTANTS---
  const inputClasses =
    "!text-black block w-full rounded-lg border border-slate-700 bg-slate-900/50 p-3 text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all";
  const labelClasses = "mb-2 block text-sm font-medium text-slate-300";

  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-slate-200 font-sans selection:bg-indigo-500/30">
      <Navbar />

      <section className="mx-auto max-w-3xl px-4 py-16">
        <div className="flex flex-col items-center justify-center text-center">
          <h1 className="text-4xl font-extrabold text-white sm:text-5xl mb-4">
            Smart feedback for your dream job
          </h1>

          {isProcessing ? (
            <div className="mt-8 w-full max-w-xl flex flex-col items-center rounded-xl bg-slate-900/50 p-8 border border-slate-800 backdrop-blur-sm">
              <h2 className="text-xl font-semibold text-indigo-300 animate-pulse mb-6">
                {statusText}
              </h2>
              <div className="relative w-full flex items-center justify-center overflow-hidden rounded-lg">
                <img
                  src="/images/resume-scan.gif"
                  className="w-[200px] opacity-90 mix-blend-screen"
                  alt="Scanning Resume"
                />
              </div>
            </div>
          ) : (
            <h2 className="text-lg text-slate-400 max-w-xl">
              Drop your resume below to receive an ATS score and personalized
              improvement tips.
            </h2>
          )}

          {!isProcessing && (
            <form
              id="upload-form"
              onSubmit={handleSubmit}
              className="mt-10 w-full rounded-2xl bg-slate-900/40 border border-slate-800 p-6 md:p-8 backdrop-blur-sm shadow-2xl"
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
                  <div className="w-full overflow-hidden rounded-lg border border-slate-700 bg-slate-900/50">
                    <FileUploader onFileSelect={handleFileSelect} />
                  </div>
                </div>

                <button
                  type="submit"
                  className="mt-4 w-full rounded-lg bg-indigo-600 px-6 py-4 text-lg font-bold text-white transition-all hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-500/25 active:scale-95"
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
