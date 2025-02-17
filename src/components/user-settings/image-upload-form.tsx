"use client";

import imageUploadSettings from "@/src/actions/image-upload";
import { ImageUploadSettingsActionState } from "@/src/types";
import { FormEvent, useEffect, useState, useTransition } from "react";
import { useCustomToast } from "@/src/hooks/useCustomToast";
import { useImgUploadConfig } from "@/src/hooks/new/useImageUploadConfig";

export default function CloudinaryConfigForm() {
  const { showToast } = useCustomToast();
  const { userConfig, isLoading, error } = useImgUploadConfig();
  const [cloudName, setCloudName] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [apiSecret, setApiSecret] = useState("");

  const [isPending, startTransition] = useTransition();
  const [formState, setFormState] = useState<ImageUploadSettingsActionState>(
    {}
  );

  useEffect(() => {
    if (userConfig) {
      setCloudName(userConfig.cloudName);
      setApiKey(userConfig.apiKey);
    }
  }, [userConfig]);

  const handleResponse = (response: ImageUploadSettingsActionState) => {
    if (response.errors) {
      setFormState(response);
    }
    if (response.generalError) {
      showToast({ status: "error", message: response.generalError });
    }
    if (response.success) {
      showToast({ status: "success", message: response.success });
    }
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormState({});

    startTransition(async () => {
      const formData = new FormData();
      formData.append("cloudName", cloudName);
      formData.append("apiKey", apiKey);
      formData.append("apiSecret", apiSecret);

      try {
        const response = await imageUploadSettings(formData);
        handleResponse(response);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        showToast({ status: "error", message: errorMessage });
      }
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
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
        {formState.errors?.cloudName && (
          <p className="text-sm text-red-500">
            {formState.errors.cloudName[0]}
          </p>
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
        {formState.errors?.apiKey && (
          <p className="text-sm text-red-500">{formState.errors.apiKey[0]}</p>
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
        {formState.errors?.apiSecret && (
          <p className="text-sm text-red-500">
            {formState.errors.apiSecret[0]}
          </p>
        )}
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {isPending ? "Saving..." : "Save Configuration"}
      </button>
    </form>
  );
}
