"use client";

import imageUploadSettings from "@/src/actions/image-upload";
import { useState, useActionState } from "react";

export default function CloudinaryConfigForm() {
  const [cloudName, setCloudName] = useState("my-cloud");
  const [apiKey, setApiKey] = useState("1234567890");
  const [apiSecret, setApiSecret] = useState("a1b2c3d4e5f6g7h8i9j0");

  const [state, formAction, pending] = useActionState(imageUploadSettings, {});

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="cloudName">Cloud Name</label>
        <input
          type="text"
          name="cloudName"
          value={cloudName}
          onChange={(e) => setCloudName(e.target.value)}
          required
          className="border rounded p-2 w-full"
        />
        {state.errors?.cloudName && (
          <p className="text-sm text-red-500">{state.errors.cloudName[0]}</p>
        )}
      </div>
      <div>
        <label htmlFor="apiKey">API Key</label>
        <input
          type="text"
          name="apiKey"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          required
          className="border rounded p-2 w-full"
        />
        {state.errors?.apiKey && (
          <p className="text-sm text-red-500">{state.errors.apiKey[0]}</p>
        )}
      </div>
      <div>
        <label htmlFor="apiSecret">API Secret</label>
        <input
          type="password"
          name="apiSecret"
          value={apiSecret}
          onChange={(e) => setApiSecret(e.target.value)}
          required
          className="border rounded p-2 w-full"
        />
        {state.errors?.apiSecret && (
          <p className="text-sm text-red-500">{state.errors.apiSecret[0]}</p>
        )}
      </div>
      <button
        type="submit"
        disabled={pending}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {pending ? "Saving..." : "Save Configuration"}
      </button>
    </form>
  );
}
