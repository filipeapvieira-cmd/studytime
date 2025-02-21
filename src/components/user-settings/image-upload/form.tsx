"use client";

import imageUploadSettings from "@/src/actions/image-upload";
import { ImageUploadSettingsActionState } from "@/src/types";
import { FormEvent, useEffect, useState, useTransition } from "react";
import { useCustomToast } from "@/src/hooks/useCustomToast";
import { useImgUploadConfig } from "@/src/hooks/new/useImageUploadConfig";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";

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
    <Card className="border-zinc-800 bg-zinc-900">
      <CardHeader>
        <CardTitle>Cloudinary Configuration</CardTitle>
        <CardDescription>
          Enter your Cloudinary credentials to enable image upload functionality
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cloudName">Cloud Name</Label>
            <Input
              type="text"
              name="cloudName"
              value={cloudName}
              onChange={(e) => setCloudName(e.target.value)}
              required
              className="border-zinc-800 bg-zinc-950"
            />
            {formState.errors?.cloudName && (
              <p className="text-sm text-red-500">
                {formState.errors.cloudName[0]}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="apiKey">API Key</Label>
            <Input
              type="text"
              name="apiKey"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              required
              className="border-zinc-800 bg-zinc-950"
            />
            {formState.errors?.apiKey && (
              <p className="text-sm text-red-500">
                {formState.errors.apiKey[0]}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="apiSecret">API Secret</Label>
            <Input
              type="password"
              name="apiSecret"
              value={apiSecret}
              onChange={(e) => setApiSecret(e.target.value)}
              required
              className="border-zinc-800 bg-zinc-950"
            />
            {formState.errors?.apiSecret && (
              <p className="text-sm text-red-500">
                {formState.errors.apiSecret[0]}
              </p>
            )}
          </div>
          <Button
            type="submit"
            disabled={isPending}
            className="w-full bg-zinc-800 hover:bg-zinc-700 text-white"
          >
            {isPending ? "Saving..." : "Save Configuration"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
