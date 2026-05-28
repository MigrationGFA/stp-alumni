'use client';
import { useEffect, useRef, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Paperclip, X, FileText, CheckCircle2, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const STEPS = ['name', 'members', 'documents'];
const STEP_LABELS = { name: 'Name', members: 'Members', documents: 'Documents' };

function StepIndicator({ current }) {
  return (
    <div className="flex items-center gap-2 mb-6">
      {STEPS.map((step, i) => {
        const idx = STEPS.indexOf(current);
        const done = i < idx;
        const active = i === idx;
        return (
          <div key={step} className="flex items-center gap-2">
            <div
              className={cn(
                'flex items-center justify-center h-6 w-6 rounded-full text-xs font-medium transition-all',
                done && 'bg-stp-blue-light text-white',
                active && 'bg-stp-blue-light text-white ring-2 ring-stp-blue-light/30',
                !done && !active && 'bg-muted text-muted-foreground',
              )}
            >
              {done ? <CheckCircle2 className="h-3.5 w-3.5" /> : i + 1}
            </div>
            <span
              className={cn(
                'text-xs',
                active ? 'text-foreground font-medium' : 'text-muted-foreground',
              )}
            >
              {STEP_LABELS[step]}
            </span>
            {i < STEPS.length - 1 && (
              <ChevronRight className="h-3 w-3 text-muted-foreground mx-1" />
            )}
          </div>
        );
      })}
    </div>
  );
}

export function CreateDealRoomModal({ open, onOpenChange, onCreate }) {
  const [step, setStep] = useState('name');
  const [roomName, setRoomName] = useState('');
  const [roomDescription, setRoomDescription] = useState('');
  const [memberSearch, setMemberSearch] = useState('');
  const [members, setMembers] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [isLaunching, setIsLaunching] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!open) {
      setStep('name');
      setRoomName('');
      setRoomDescription('');
      setMemberSearch('');
      setMembers([]);
      setDocuments([]);
      setIsLaunching(false);
    }
  }, [open]);

  const handleAddMember = () => {
    const name = memberSearch.trim();
    if (!name) return;
    setMembers((prev) => {
      if (prev.some((m) => m.name.toLowerCase() === name.toLowerCase())) return prev;
      return [...prev, { id: `member_${Date.now()}`, name }];
    });
    setMemberSearch('');
  };

  const handleFileSelected = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setDocuments((prev) => [
      ...prev,
      { id: `doc_${Date.now()}`, name: file.name, file },
    ]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleLaunch = async () => {
    if (!roomName.trim() || isLaunching) return;
    setIsLaunching(true);
    await onCreate?.({ name: roomName.trim(), description: roomDescription.trim(), members, documents });
    setIsLaunching(false);
  };

  const renderNameStep = () => (
    <>
      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="room-name" className="text-sm font-medium">
            Room name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="room-name"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            placeholder="e.g. Series A Negotiations"
            className="w-full"
            onKeyDown={(e) => e.key === 'Enter' && roomName.trim() && setStep('members')}
            autoFocus
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="room-desc" className="text-sm font-medium">
            Description <span className="text-muted-foreground text-xs font-normal">(optional)</span>
          </Label>
          <Input
            id="room-desc"
            value={roomDescription}
            onChange={(e) => setRoomDescription(e.target.value)}
            placeholder="Brief description of this deal room"
            className="w-full"
          />
        </div>
      </div>
      <DialogFooter className="mt-6">
        <Button
          className="w-full rounded-full bg-stp-blue-light text-white hover:bg-stp-blue-light/90"
          onClick={() => setStep('members')}
          disabled={!roomName.trim()}
        >
          Continue
        </Button>
      </DialogFooter>
    </>
  );

  const renderMembersStep = () => (
    <>
      <div className="space-y-5">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Add member</Label>
          <div className="flex gap-2">
            <Input
              value={memberSearch}
              onChange={(e) => setMemberSearch(e.target.value)}
              placeholder="Search by name or user ID"
              className="flex-1"
              onKeyDown={(e) => e.key === 'Enter' && handleAddMember()}
            />
            <Button
              className="rounded-full bg-stp-blue-light text-white hover:bg-stp-blue-light/90 px-5"
              onClick={handleAddMember}
              disabled={!memberSearch.trim()}
            >
              Add
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">
              Members {members.length > 0 && (
                <span className="ml-1 text-xs text-muted-foreground">({members.length})</span>
              )}
            </Label>
          </div>
          {members.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border p-6 text-center">
              <p className="text-sm text-muted-foreground">No members added yet.</p>
              <p className="text-xs text-muted-foreground mt-1">
                You can also add them after creating the room.
              </p>
            </div>
          ) : (
            <ul className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
              {members.map((m) => (
                <li
                  key={m.id}
                  className="flex items-center justify-between rounded-lg border border-border px-3 py-2 group"
                >
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-full bg-stp-blue-light/10 text-stp-blue-light text-xs font-semibold flex items-center justify-center">
                      {m.name[0].toUpperCase()}
                    </div>
                    <span className="text-sm">{m.name}</span>
                  </div>
                  <button
                    onClick={() => setMembers((prev) => prev.filter((x) => x.id !== m.id))}
                    className="text-muted-foreground hover:text-destructive transition-colors p-1 rounded"
                    aria-label={`Remove ${m.name}`}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <DialogFooter className="mt-6 flex-row gap-2">
        <Button variant="outline" className="flex-1 rounded-full" onClick={() => setStep('name')}>
          Back
        </Button>
        <Button
          className="flex-1 rounded-full bg-stp-blue-light text-white hover:bg-stp-blue-light/90"
          onClick={() => setStep('documents')}
        >
          Continue
        </Button>
      </DialogFooter>
    </>
  );

  const renderDocumentsStep = () => (
    <>
      <div className="space-y-5">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Upload documents</Label>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border p-6 hover:border-stp-blue-light/50 hover:bg-muted/30 transition-all group cursor-pointer"
          >
            <div className="h-10 w-10 rounded-full bg-muted group-hover:bg-stp-blue-light/10 transition-colors flex items-center justify-center">
              <Paperclip className="h-4 w-4 text-muted-foreground group-hover:text-stp-blue-light transition-colors" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium">Click to select a file</p>
              <p className="text-xs text-muted-foreground mt-0.5">Any file type up to 50MB</p>
            </div>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileSelected}
          />
        </div>

        {documents.length > 0 && (
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">
              Queued ({documents.length})
            </Label>
            <ul className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
              {documents.map((doc) => (
                <li
                  key={doc.id}
                  className="flex items-center gap-2.5 rounded-lg border border-border px-3 py-2"
                >
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-stp-blue-light text-[10px] font-bold text-white shrink-0">
                    <FileText className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-sm truncate flex-1">{doc.name}</span>
                  <button
                    onClick={() => setDocuments((prev) => prev.filter((d) => d.id !== doc.id))}
                    className="text-muted-foreground hover:text-destructive transition-colors p-1 shrink-0"
                    aria-label="Remove document"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <p className="text-xs text-muted-foreground">
          Documents can also be uploaded after the room is created. Only members who have signed the NDA can view them.
        </p>
      </div>

      <DialogFooter className="mt-6 flex-col gap-2">
        <Button
          className="w-full rounded-full bg-stp-blue-light text-white hover:bg-stp-blue-light/90 py-5"
          onClick={handleLaunch}
          disabled={isLaunching}
        >
          {isLaunching ? 'Launching…' : 'Launch Deal Room'}
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1 rounded-full" onClick={() => setStep('members')}>
            Back
          </Button>
          <Button
            variant="ghost"
            className="flex-1 rounded-full text-muted-foreground"
            onClick={handleLaunch}
            disabled={isLaunching}
          >
            Skip & Launch
          </Button>
        </div>
      </DialogFooter>
    </>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Deal Room</DialogTitle>
          <DialogDescription>
            A secure, private space for confidential deal communications.
          </DialogDescription>
        </DialogHeader>

        <StepIndicator current={step} />

        {step === 'name' && renderNameStep()}
        {step === 'members' && renderMembersStep()}
        {step === 'documents' && renderDocumentsStep()}
      </DialogContent>
    </Dialog>
  );
}