'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useSnackbar } from 'notistack';
import { cn } from '@nl/ui/utils';
import { Icon } from '@nl/ui/base/icon';

import styles from '../../styles/profile.module.css';

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

  return (
    <div className={styles.avatarContainer}>
      {url ? (
        <Image
          src={url}
          alt="Avatar"
          className={cn(styles.avatar, styles.image)}
          height={size}
          width={size}
          style={{ maxWidth: '100%', height: 'auto' }}
        />
      ) : (
        <div className={cn(styles.avatar, styles.no_image)} style={{ height: size, width: size }} />
      )}
      <div style={{ width: size }}>
        <label className={cn(styles.button_primary, 'block btn')} style={{ marginBottom: 0 }} htmlFor="single">
          {uploading ? (
            'Uploading ...'
          ) : (
            <>
              <Icon name="upload" /> Upload
            </>
          )}
        </label>
        <input
          style={{ visibility: 'hidden', position: 'absolute' }}
          type="file"
          id="single"
          accept="image/*"
          onChange={uploadAvatar}
          disabled={uploading}
        />
      </div>
    </div>
  );
}
