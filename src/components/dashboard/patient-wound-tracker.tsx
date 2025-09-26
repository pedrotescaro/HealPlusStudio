'use client';
import type {Patient, WoundEntry} from '../../lib/types';
import {useState, useRef} from 'react';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '../ui/card';
import {Button} from '../ui/button';
import {Textarea} from '../ui/textarea';
import {Input} from '../ui/input';
import {Label} from '../ui/label';
import {formatDate} from '../../lib/utils';
import {
  getWoundRiskAssessmentAction,
  summarizeWoundProgressAction,
} from '../../app/actions';
import {useToast} from '../../hooks/use-toast';
import {Alert, AlertDescription, AlertTitle} from '../ui/alert';
import {Lightbulb, Bot, Loader2, Sparkles, Upload} from 'lucide-react';

const fileToDataUri = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export function PatientWoundTracker({
  initialPatient,
}: {
  initialPatient: Patient;
}) {
  const {toast} = useToast();
  const [patient, setPatient] = useState<Patient>(initialPatient);
  const [isLoading, setIsLoading] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [newNote, setNewNote] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const file = fileInputRef.current?.files?.[0];

    if (!newNote || !file) {
      toast({
        title: 'Missing Information',
        description: 'Please provide both notes and an image.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const photoDataUri = await fileToDataUri(file);
      const newWoundId = `w${Date.now()}`;
      const newEntry: WoundEntry = {
        id: newWoundId,
        date: new Date().toISOString(),
        notes: newNote,
        imageUrl: URL.createObjectURL(file), // For local display
        imageHint: 'new wound',
      };

      const assessment = await getWoundRiskAssessmentAction(
        patient.id,
        newWoundId,
        newNote,
        photoDataUri
      );

      newEntry.aiAssessment = assessment;

      setPatient(prev => ({
        ...prev,
        wounds: [newEntry, ...prev.wounds],
      }));
      setNewNote('');
      setPreviewImage(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      toast({
        title: 'AI Assessment Complete',
        description: 'The new wound entry has been saved.',
      });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description:
          error instanceof Error ? error.message : 'An unknown error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSummarize = async () => {
    setIsSummarizing(true);
    try {
      const images = patient.wounds.map(w => w.imageUrl); // In a real app, you'd fetch the data URIs
      const notes = patient.wounds.map(w => `On ${formatDate(w.date)}: ${w.notes}`).join('\n');
      
      // For demo, we can't get data URIs from picsum URLs, so we'll send the first one we can.
      const firstWoundImage = document.getElementById(`wound-img-${patient.wounds[0].id}`) as HTMLImageElement;
      if (!firstWoundImage) {
        throw new Error("Could not find an image to process for summary.");
      }
      
      const canvas = document.createElement('canvas');
      canvas.width = firstWoundImage.naturalWidth;
      canvas.height = firstWoundImage.naturalHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(firstWoundImage, 0, 0);
      const dataUri = canvas.toDataURL();


      const summary = await summarizeWoundProgressAction(patient.id, [dataUri], notes);

      setPatient(prev => ({
        ...prev,
        progressSummary: summary.summary,
      }));
      toast({
        title: 'Progress Summarized',
        description: 'AI has generated a healing progress summary.',
      });
    } catch (error) {
       console.error(error);
      toast({
        title: 'Summarization Failed',
        description:
          error instanceof Error ? error.message : 'An unknown error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsSummarizing(false);
    }
  }

  return (
    <div className="grid gap-8 md:grid-cols-3">
      <div className="md:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>New Wound Entry</CardTitle>
            <CardDescription>
              Add a new photo and notes to track progress.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="wound-photo">Wound Photo</Label>
                <Input
                  id="wound-photo"
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
              </div>
              {previewImage && (
                <div className="relative aspect-video w-full overflow-hidden rounded-md">
                  <Image
                    src={previewImage}
                    alt="Wound preview"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="wound-notes">Notes</Label>
                <Textarea
                  id="wound-notes"
                  placeholder="Describe the wound's appearance, size, etc."
                  value={newNote}
                  onChange={e => setNewNote(e.target.value)}
                  rows={4}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Bot className="mr-2 h-4 w-4" />
                )}
                Save & Assess with AI
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
      <div className="md:col-span-2 space-y-6">
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle>Healing Progress</CardTitle>
              <CardDescription>
                A timeline of all recorded wound entries.
              </CardDescription>
            </div>
            <Button onClick={handleSummarize} disabled={isSummarizing} variant="outline">
              {isSummarizing ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
              Summarize
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {patient.progressSummary && (
               <Alert className="bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800">
                  <Sparkles className="h-4 w-4 !text-blue-500" />
                  <AlertTitle className="text-blue-900 dark:text-blue-300">AI Progress Summary</AlertTitle>
                  <AlertDescription className="text-blue-800 dark:text-blue-400">
                   {patient.progressSummary}
                  </AlertDescription>
                </Alert>
            )}
            <div className="space-y-6">
              {patient.wounds.map(entry => (
                <Card key={entry.id} className="overflow-hidden">
                  <div className="grid md:grid-cols-2">
                    <div className="relative aspect-video">
                      <Image
                        id={`wound-img-${entry.id}`}
                        src={entry.imageUrl}
                        alt={`Wound on ${formatDate(entry.date)}`}
                        fill
                        className="object-cover"
                        data-ai-hint={entry.imageHint}
                        crossOrigin="anonymous"
                      />
                    </div>
                    <div className="p-4">
                      <h4 className="font-semibold">
                        Entry from {formatDate(entry.date)}
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {entry.notes}
                      </p>

                      {entry.aiAssessment && (
                        <Alert className="mt-4 bg-amber-50 border-amber-200 dark:bg-amber-950 dark:border-amber-800">
                          <Lightbulb className="h-4 w-4 !text-amber-500" />
                          <AlertTitle className="text-amber-900 dark:text-amber-300">AI Risk Assessment</AlertTitle>
                          <AlertDescription className="text-amber-800 dark:text-amber-400">
                            <p className="font-medium">
                              {entry.aiAssessment.riskAssessment}
                            </p>
                            <p>{entry.aiAssessment.recommendations}</p>
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
