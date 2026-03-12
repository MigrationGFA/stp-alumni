import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, Paperclip } from "lucide-react";

const INITIAL_MEMBERS = [];
const INITIAL_DOCUMENTS = [];

export function CreateDealRoomModal({ open, onOpenChange, onCreate }) {
  const [step, setStep] = useState("name"); // "name" | "members" | "documents"
  const [roomName, setRoomName] = useState("");
  const [memberSearch, setMemberSearch] = useState("");
  const [members, setMembers] = useState(INITIAL_MEMBERS);
  const [documents, setDocuments] = useState(INITIAL_DOCUMENTS);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!open) {
      setStep("name");
      setRoomName("");
      setMemberSearch("");
      setMembers(INITIAL_MEMBERS);
      setDocuments(INITIAL_DOCUMENTS);
    }
  }, [open]);

  const handleNameNext = () => {
    if (!roomName.trim()) return;
    setStep("members");
  };

  const handleAddMember = () => {
    const name = memberSearch.trim();
    if (!name) return;

    setMembers((prev) => {
      if (prev.some((m) => m.name.toLowerCase() === name.toLowerCase())) {
        return prev;
      }
      const nextId = `member_${Date.now()}_${prev.length + 1}`;
      return [...prev, { id: nextId, name }];
    });
    setMemberSearch("");
  };

  const handleRemoveMember = (id) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
  };

  const handleMembersNext = () => {
    setStep("documents");
  };

  const handleFileSelected = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setDocuments((prev) => [
      ...prev,
      {
        id: `doc_${Date.now()}_${prev.length + 1}`,
        name: file.name,
        file,
      },
    ]);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleLaunch = () => {
    if (!roomName.trim()) return;
    const payload = {
      name: roomName.trim(),
      members,
      documents,
    };
    onCreate?.(payload);
  };

  const handleDialogChange = (nextOpen) => {
    onOpenChange?.(nextOpen);
  };

  const renderNameStep = () => (
    <>
      <DialogHeader>
        <DialogTitle>Create Room</DialogTitle>
        <DialogDescription>Create a new deal room</DialogDescription>
      </DialogHeader>
      <div className="space-y-4 py-2">
        <Input
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          placeholder="Interview with AM"
          className="w-full"
        />
      </div>
      <DialogFooter>
        <Button
          className="bg-stp-blue-light text-white hover:bg-stp-blue-light/90 w-full sm:w-auto rounded-full"
          onClick={handleNameNext}
          disabled={!roomName.trim()}
        >
          Name a Room
        </Button>
      </DialogFooter>
    </>
  );

  const renderMembersStep = () => (
    <>
      <DialogHeader>
        <DialogTitle>Members</DialogTitle>
      </DialogHeader>
      <div className="space-y-6 py-2">
        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">Add new member</p>
          <div className="flex gap-2">
            <Input
              value={memberSearch}
              onChange={(e) => setMemberSearch(e.target.value)}
              placeholder="Search for a user name"
              className="flex-1"
            />
            <Button
              className="bg-stp-blue-light text-white hover:bg-stp-blue-light/90 rounded-full px-6"
              onClick={handleAddMember}
            >
              Add
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">
            List of member{members.length !== 1 ? "s" : ""}
          </p>
          {members.length === 0 ? (
            <p className="text-xs text-muted-foreground">
              Added members will appear here.
            </p>
          ) : (
            <ul className="space-y-2 max-h-48 overflow-y-auto">
              {members.map((member) => (
                <li
                  key={member.id}
                  className="flex items-center justify-between rounded-lg border border-border px-3 py-2"
                >
                  <span className="text-sm">{member.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => handleRemoveMember(member.id)}
                  >
                    Remove
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-2">
        <Button
          variant="outline"
          className="w-full sm:w-auto rounded-full"
          onClick={() => setStep("name")}
        >
          Back
        </Button>
        <Button
          className="w-full sm:w-auto bg-stp-blue-light text-white hover:bg-stp-blue-light/90 rounded-full"
          onClick={handleMembersNext}
        >
          Next
        </Button>
      </DialogFooter>
    </>
  );

  const renderDocumentsStep = () => (
    <>
      <DialogHeader>
        <DialogTitle>Upload Document</DialogTitle>
      </DialogHeader>
      <div className="space-y-6 py-2">
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">
            Choose Document
          </Label>
          <div className="flex gap-2">
            <Input
              readOnly
              placeholder="Select a File"
              className="flex-1 cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center justify-center rounded-full h-10 w-10 bg-muted text-muted-foreground hover:bg-muted/80"
            >
              <Paperclip className="h-4 w-4" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileSelected}
            />
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              className="bg-stp-blue-light text-white hover:bg-stp-blue-light/90 rounded-full flex-1"
              onClick={() => fileInputRef.current?.click()}
            >
              Add
            </Button>
            <Button
              type="button"
              variant="outline"
              className="rounded-full flex-1"
              onClick={handleLaunch}
            >
              Skip
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">
            Documents Uploaded
          </p>
          {documents.length === 0 ? (
            <p className="text-xs text-muted-foreground">
              Uploaded documents will appear here.
            </p>
          ) : (
            <ul className="space-y-2">
              {documents.map((doc) => (
                <li
                  key={doc.id}
                  className="flex items-center gap-2 text-sm text-foreground"
                >
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-stp-blue-light text-[10px] font-semibold text-white">
                    PDF
                  </span>
                  <span className="truncate flex-1">{doc.name}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <DialogFooter className="flex flex-col gap-2">
        <Button
          className="w-full bg-stp-blue-light text-white hover:bg-stp-blue-light/90 rounded-full"
          onClick={handleLaunch}
        >
          Launch Deal Room
        </Button>
      </DialogFooter>
    </>
  );

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent className="sm:max-w-md">
        {step === "name" && renderNameStep()}
        {step === "members" && renderMembersStep()}
        {step === "documents" && renderDocumentsStep()}
      </DialogContent>
    </Dialog>
  );
}

