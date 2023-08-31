import { createDummyData } from "@/docs/dummy-data";

export default async function Home() {
  //migrateSessionData();
  //createDummyData();
  return (
    <>
      <div className="container">
        <div className="w-full h-64 flex items-center justify-center text-white">
          <h1 className="text-4xl font-bold">
            Unleash your study potential now
          </h1>
        </div>
      </div>
      <div className="container bg-secondary/90 rounded-lg shadow-lg">
        <div className="bg-gradient-to-r from-bg-primary to-secondary w-full h-64 flex items-center justify-center text-white">
          <h3 className="text-2xl font-bold">
            Transform the way you study and keep track of your notes.
          </h3>
        </div>
      </div>
    </>
  );
}
