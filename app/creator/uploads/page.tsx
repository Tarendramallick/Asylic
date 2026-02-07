'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CreatorSidebar } from '@/components/dashboard/creator-sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, File, Trash2 } from 'lucide-react';
import { db } from '@/lib/db';

export default function UploadsPage() {
  const router = useRouter();
  const [creatorId, setCreatorId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/login?role=creator');
      return;
    }

    const id = localStorage.getItem('creatorId');
    if (id) {
      setCreatorId(id);
    }
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  const uploads = Array.from(db.fileUploads.values()).filter((u) => u.creatorId === creatorId);

  return (
    <div className="flex min-h-screen bg-background">
      <CreatorSidebar />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-20">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 md:ml-0">
            <div className="flex items-center justify-between">
              <div className="ml-14 md:ml-0">
                <h1 className="text-2xl font-bold text-foreground">My Uploads</h1>
                <p className="text-sm text-muted-foreground">Manage your portfolio and campaign submissions</p>
              </div>
              <Button className="bg-primary hover:bg-primary/90">
                <Upload className="h-4 w-4 mr-2" />
                Upload File
              </Button>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-8 sm:px-6 lg:px-8">
          {/* Upload Area */}
          <Card className="border-2 border-dashed mb-8">
            <CardContent className="pt-12 pb-12">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-lg bg-primary/10 mb-4">
                  <Upload className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Drop files here or click to upload
                </h3>
                <p className="text-muted-foreground mb-4">
                  Max file size: 5MB • Supported: JPG, PNG, MP4, PDF, DOCX
                </p>
                <Button variant="outline">Choose Files</Button>
              </div>
            </CardContent>
          </Card>

          {/* Files List */}
          <Card>
            <CardHeader>
              <CardTitle>Your Files</CardTitle>
              <CardDescription>
                {uploads.length} file{uploads.length !== 1 ? 's' : ''} uploaded
              </CardDescription>
            </CardHeader>
            <CardContent>
              {uploads.length > 0 ? (
                <div className="space-y-3">
                  {uploads.map((upload) => (
                    <div
                      key={upload.id}
                      className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-card/50 transition"
                    >
                      <div className="flex items-center gap-4">
                        <File className="h-8 w-8 text-muted-foreground" />
                        <div>
                          <p className="font-medium text-foreground">{upload.fileName}</p>
                          <p className="text-sm text-muted-foreground">
                            {(upload.fileSize / 1024 / 1024).toFixed(2)}MB • {new Date(upload.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">No files uploaded yet</p>
                  <Button className="bg-primary hover:bg-primary/90">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Your First File
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
