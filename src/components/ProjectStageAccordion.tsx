import React, { useState, useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  ProjectStage,
  STAGE_STATUS,
  StageStatusValue,
  formatDateTime,
} from "@/lib/index";
import {
  Clock,
  User,
  Save,
  Info,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ProjectStageAccordionProps {
  projectId: string;
  stages: ProjectStage[];
  onStageUpdate: (stageId: string, updates: Partial<ProjectStage>) => void;
}

export function ProjectStageAccordion({
  projectId,
  stages,
  onStageUpdate,
}: ProjectStageAccordionProps) {
  const sortedStages = [...stages].sort((a, b) => a.stage_order - b.stage_order);

  // Find the current active stage to expand it by default
  const activeStage = sortedStages.find((s) => s.status === "in_progress") || sortedStages.find((s) => s.status === "not_started") || sortedStages[0];
  const [expandedValue, setExpandedValue] = useState<string | undefined>(activeStage?.id);

  // Update expanded value if the active stage changes (e.g., auto-progression)
  useEffect(() => {
    const currentActive = sortedStages.find((s) => s.status === "in_progress");
    if (currentActive) {
      setExpandedValue(currentActive.id);
    }
  }, [sortedStages]);

  const handleStatusChange = (stageId: string, newStatus: StageStatusValue) => {
    onStageUpdate(stageId, { status: newStatus });
  };

  const handleSaveNotes = (stageId: string, notes: string) => {
    onStageUpdate(stageId, { notes });
  };

  return (
    <div className="w-full space-y-4" dir="rtl" data-project-id={projectId}>
      <Accordion
        type="single"
        collapsible
        value={expandedValue}
        onValueChange={setExpandedValue}
        className="w-full space-y-3"
      >
        {sortedStages.map((stage) => {
          const statusConfig = Object.values(STAGE_STATUS).find(
            (s) => s.value === stage.status
          );

          return (
            <AccordionItem
              key={stage.id}
              value={stage.id}
              className={cn(
                "border rounded-xl px-4 bg-card transition-all duration-200",
                stage.status === "in_progress" ? "border-primary shadow-sm ring-1 ring-primary/20" : "border-border"
              )}
            >
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between w-full gap-4 text-right">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold",
                      stage.status === "completed" ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"
                    )}>
                      {stage.status === "completed" ? <CheckCircle2 className="w-5 h-5" /> : stage.stage_order}
                    </div>
                    <span className="font-bold text-lg">{stage.name}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <Badge
                      variant="outline"
                      className={cn(
                        "px-3 py-1 border-none font-medium",
                        statusConfig?.color
                      )}
                    >
                      {statusConfig?.label}
                    </Badge>

                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>{stage.responsible_user_id || "غير محدد"}</span>
                    </div>

                    {(stage.last_updated_by || stage.last_updated_at) && (
                      <div className="flex items-center gap-2 text-xs">
                        <span>{stage.last_updated_by || "—"}</span>
                        <span className="text-muted-foreground/80">•</span>
                        <span>{formatDateTime(stage.last_updated_at || "")}</span>
                      </div>
                    )}
                  </div>
                </div>
              </AccordionTrigger>

              <AccordionContent className="pt-2 pb-6 border-t">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
                  {/* Right Column: Status & Updates */}
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold">حالة المرحلة</Label>
                      <Select
                        value={stage.status}
                        onValueChange={(value: StageStatusValue) =>
                          handleStatusChange(stage.id, value)
                        }
                      >
                        <SelectTrigger className="w-full bg-background">
                          <SelectValue placeholder="اختر الحالة" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(STAGE_STATUS).map((status) => (
                            <SelectItem key={status.value} value={status.value}>
                              <div className="flex items-center gap-2">
                                <div className={cn("w-2 h-2 rounded-full", status.color.split(' ')[1])} />
                                {status.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="p-4 rounded-lg bg-muted/30 border border-dashed border-muted-foreground/20 space-y-3">
                      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <Info className="w-4 h-4" />
                        معلومات التحديث الأخير
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div className="space-y-1">
                          <span className="text-muted-foreground block">بواسطة:</span>
                          <span className="font-medium">{stage.last_updated_by || "النظام"}</span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-muted-foreground block">التاريخ والوقت:</span>
                          <span className="font-medium">{formatDateTime(stage.last_updated_at)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Left Column: Notes */}
                  <div className="space-y-2 flex flex-col">
                    <Label className="text-sm font-semibold">ملاحظات المرحلة</Label>
                    <StageNotesField
                      initialNotes={stage.notes}
                      onSave={(notes) => handleSaveNotes(stage.id, notes)}
                    />
                    <div className="mt-auto flex gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        التخطيط:
                      </div>

                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}

/**
 * Internal sub-component for managing local state of notes before saving
 */
function StageNotesField({
  initialNotes,
  onSave
}: {
  initialNotes: string;
  onSave: (notes: string) => void
}) {
  const [notes, setNotes] = useState(initialNotes);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    setNotes(initialNotes);
    setIsDirty(false);
  }, [initialNotes]);

  const handleSave = () => {
    onSave(notes);
    setIsDirty(false);
  };

  return (
    <div className="space-y-2 flex-1 flex flex-col">
      <Textarea
        value={notes}
        onChange={(e) => {
          setNotes(e.target.value);
          setIsDirty(true);
        }}
        placeholder="أدخل أي ملاحظات أو تحديثات فنية هنا..."
        className="flex-1 min-h-[120px] bg-background resize-none leading-relaxed"
      />
      <div className="flex justify-end">
        <Button
          size="sm"
          variant={isDirty ? "default" : "outline"}
          disabled={!isDirty}
          onClick={handleSave}
          className="gap-2"
        >
          <Save className="w-4 h-4" />
          حفظ الملاحظات
        </Button>
      </div>
    </div>
  );
}
