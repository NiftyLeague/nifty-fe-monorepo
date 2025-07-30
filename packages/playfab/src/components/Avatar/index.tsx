'use client';

import React, { useState, useRef } from 'react';
import { useSnackbar } from 'notistack';
import Image from 'next/image';

import { Button } from '@nl/ui/base/button';
import { Input } from '@nl/ui/custom/Input';
import { Icon } from '@nl/ui/base/icon';

export default function Avatar({
  uid,
  url,
  size,
  onUpload,
}: {
  uid: string;
  url?: string;
  size: number;
  onUpload: (url: string) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const uploadAvatar: React.ChangeEventHandler<HTMLInputElement> = async event => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file?.name?.split('.').pop();
      const fileName = `${uid}.${fileExt}`;
      const filePath = `${fileName}`;

      // TODO: handle upload image to S3

      onUpload(filePath);
    } catch (error) {
      enqueueSnackbar('Error updating avatar.', { variant: 'error' });
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current && !uploading) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="w-full grid justify-items-center gap-2">
      {url ? (
        <Image
          src={url}
          alt="Avatar"
          className="rounded-full"
          height={size}
          width={size}
          style={{ width: size, height: size }}
        />
      ) : (
        <div className="bg-background border rounded-full" style={{ height: size, width: size }} />
      )}
      <div style={{ width: size }}>
        <Button disabled={uploading} className="w-full" onClick={handleButtonClick}>
          {uploading ? (
            <>
              <Icon name="loader" className="animate-spin" /> Uploading
            </>
          ) : (
            <>
              <Icon name="upload" /> Upload
            </>
          )}
        </Button>
        <Input
          ref={fileInputRef}
          style={{ visibility: 'hidden', position: 'absolute' }}
          type="file"
          id="upload-hidden-input"
          accept="image/*"
          onChange={uploadAvatar}
          disabled={uploading}
        />
      </div>
    </div>
  );
}
