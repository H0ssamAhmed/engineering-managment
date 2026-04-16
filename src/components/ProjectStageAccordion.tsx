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
  ProjectLog,
  ProjectStatus,
  ProjectStatusEnum,
  STAGE_STATUS,
  StageStatusValue,
  formatDateTime,
  User,
} from "@/lib/index";
import {
  Save,
  Info,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { updateProject, updateProjectStage } from "@/api/projects";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import UpdateStageSkeleton from "./UpdateStageSkeleton";
import { useUsers } from "@/hooks/useUsers";
import { Link, useNavigate } from "react-router-dom";

interface ProjectStageAccordionProps {
  projectId: string;
  projectStatus: ProjectStatus;
  stages: ProjectStage[];
  addLog: (log: Omit<ProjectLog, "id" | "created_at">) => Promise<void>;
  userId: string;
}

export function ProjectStageAccordion({
  projectId,
  projectStatus,
  stages,
  addLog,
  userId,
}: ProjectStageAccordionProps) {
  const queryClient = useQueryClient()
  const { profile, isUserActive } = useAuth()
  const [currentUpdatedId, setCurrentUpdatedId] = useState<string>("")
  const sortedStages = [...stages]//.sort((a, b) => a.stage_order - b.stage_order);
  const { users, isLoading } = useUsers()
  const navigate = useNavigate();

  const { mutate: updateStage, isPending } = useMutation({
    mutationFn: ({
      stageId,
      payload,
    }: {
      stageId: string;
      payload: Partial<ProjectStage>;
      stageName: string;
      previousStatus: StageStatusValue;
      previousNotes: string;
    }) => updateProjectStage(stageId, payload, profile.id),

    onSuccess: async (_data, variables) => {
      const { stageId, payload, stageName, previousStatus, previousNotes } =
        variables;
      if (userId) {
        if (
          payload.status !== undefined &&
          payload.status !== previousStatus
        ) {
          if (payload.status === "completed") {
            await addLog({
              project_id: projectId,
              stage_id: stageId,
              user_id: userId,
              action_type: "stage_completion",
              old_value: previousStatus,
              new_value: payload.status,
              comment: `تم إكمال المرحلة "${stageName}"`,
            });
          } else {
            const label =
              Object.values(STAGE_STATUS).find((s) => s.value === payload.status)
                ?.label || payload.status;
            await addLog({
              project_id: projectId,
              stage_id: stageId,
              user_id: userId,
              action_type: "status_change",
              old_value: previousStatus,
              new_value: payload.status,
              comment: `تم تغيير حالة المرحلة "${stageName}" إلى ${label}`,
            });
          }
        }
        if (
          payload.notes !== undefined &&
          payload.notes !== previousNotes
        ) {
          await addLog({
            project_id: projectId,
            stage_id: stageId,
            user_id: userId,
            action_type: "note_update",
            old_value: previousNotes,
            new_value: payload.notes,
            comment: `تم تحديث ملاحظات المرحلة "${stageName}"`,
          });
        }
      }
      queryClient.invalidateQueries({ queryKey: [projectId] });
      toast.success(" تم تحديث المرحلة بنجاح ");
      setCurrentUpdatedId("")
    },
    onError: (error) => {
      toast.error("حصل مشكلة أثناء التحديث:" + error);
      console.error("حصل مشكلة أثناء التحديث:", error);
      setCurrentUpdatedId("")
    }
  });

  const { mutate: updateProjectStatus, isPending: isUpdateingStatus } = useMutation({
    mutationFn: ({
      newStatus,
    }: {
      newStatus: ProjectStatus;
      oldStatus: ProjectStatus;
    }) => updateProject(projectId, { status: newStatus }),
    onSuccess: async (_data, variables) => {
      if (
        userId &&
        variables.newStatus !== variables.oldStatus
      ) {
        await addLog({
          project_id: projectId,
          user_id: userId,
          action_type: "status_change",
          old_value: variables.oldStatus,
          new_value: variables.newStatus,
          comment:
            variables.newStatus === "completed"
              ? "تم تسجيل اكتمال المشروع"
              : `تم تحديث حالة المشروع إلى ${ProjectStatusEnum[variables.newStatus]}`,
        });
      }
      queryClient.invalidateQueries({ queryKey: [projectId] });
      toast.success(" تم تحديث حالة المشروع ");
      setCurrentUpdatedId("")
    },
    onError: (error) => {
      toast.error("حصل مشكلة أثناء التحديث:" + error);
      console.error("حصل مشكلة أثناء التحديث:", error);
      setCurrentUpdatedId("")

    }
  });
  const activeStage = sortedStages.find((s) => s.status === "in_progress") || sortedStages.find((s) => s.status === "not_started") || sortedStages[0];
  const [expandedValue, setExpandedValue] = useState<string | undefined>(activeStage?.id);
  const handleStatusChange = (
    stageId: string,
    newStatus: StageStatusValue,
    stageName: string,
    previousStatus: StageStatusValue,
    previousNotes: string,
  ) => {
    if (!isUserActive) {
      toast.error("حسابك غير نشط ،يرجي التواصل مع المدير.")
      return
    }

    setCurrentUpdatedId(stageId)
    updateStage({
      stageId,
      payload: { status: newStatus },
      stageName,
      previousStatus,
      previousNotes,
    })
    const isLastStage = stageName === "التقديم في بلدي";

    if (!isLastStage) return;

    const nextProjectStatus = newStatus === "completed" ? "completed" : "active";
    updateProjectStatus({
      newStatus: nextProjectStatus,
      oldStatus: projectStatus,
    });
  }

  const handleSaveNotes = async (
    stageId: string,
    notes: string,
    stageName: string,
    previousStatus: StageStatusValue,
    previousNotes: string,
  ) => {
    if (!isUserActive) {
      toast.error("حسابك للقراءة فقط، لا يمكنك التعديل.")
      return
    }
    setCurrentUpdatedId(stageId)
    updateStage({
      stageId,
      payload: { notes },
      stageName,
      previousStatus,
      previousNotes,
    })
  };


  const assignToEng = ({ value, stage }: { value: string, stage: ProjectStage }) => {
    console.log(value);
    const targetUser = users.find(user => user.id == value)
    if (profile.role != "MANAGER") {
      toast.error(`غير مصرح لك بهذا لاجراء`)
      return
    }

    if (!targetUser.is_active) {
      toast((t) => (
        <div onClick={() => {
          navigate(`/users`);
          toast.dismiss(t.id);
        }}
          className="cursor-pointer"
        >
          حساب <strong>{targetUser.name}</strong>  غير نشط, <Button size="sm" variant="outline">اضغط لتنشيطه</Button>        </div>
      ), {
        icon: "⚠️",
      });
      return
    }
    setCurrentUpdatedId(stage.id)
    updateStage({
      stageId: stage.id,
      payload: { responsible_user_id: value },
      stageName: stage.name,
      previousStatus: stage.status,
      previousNotes: stage.notes || "",
    })
  }
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



                    {(stage.last_updated_by || stage.last_updated_at) && (
                      <div className="flex items-center gap-2 text-xs">
                        <span>{stage.last_updated_by_user?.name || "—"}</span>
                        <span className="text-muted-foreground/80">•</span>
                        <span>{formatDateTime(stage.last_updated_at || "")}</span>
                      </div>
                    )}
                  </div>
                </div>
              </AccordionTrigger>

              {isPending && currentUpdatedId == stage.id ?
                <UpdateStageSkeleton />
                : <AccordionContent className="pt-2 pb-6 border-t">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
                    {/* Right Column: Status & Updates */}
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold">حالة المرحلة</Label>
                        <Select
                          value={stage.status}
                          onValueChange={(value: StageStatusValue) =>
                            handleStatusChange(
                              stage.id,
                              value,
                              stage.name,
                              stage.status,
                              stage.notes,
                            )
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
                        <div className="grid grid-cols-4 gap-4 text-xs">
                          <div className="space-y-1">
                            <span className="text-muted-foreground block">بواسطة:</span>
                            <span className="font-medium">{stage.last_updated_by_user?.name || "النظام"}</span>
                          </div>
                          <div className="space-y-1">
                            <span className="text-muted-foreground block">التاريخ والوقت:</span>
                            <span className="font-medium">{formatDateTime(stage.last_updated_at)}</span>
                          </div>
                          <div className="space-y-1 col-span-2">
                            <Label className="text-muted-foreground block text-[12px]">مسند الي : </Label>
                            <Select
                              dir="rtl"
                              value={stage.responsible_user_id || ""}
                              onValueChange={(value) => assignToEng({ value, stage })}
                            >
                              <SelectTrigger className="w-full bg-background">
                                <SelectValue placeholder="اختر المهندس" />
                              </SelectTrigger>

                              <SelectContent>
                                {users
                                  .filter(u => u.role !== "MANAGER")
                                  .map((user: User) => (
                                    <SelectItem key={user.id} value={user.id}>
                                      <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full" />
                                        {user.name}
                                      </div>
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Left Column: Notes */}
                    <div className="space-y-2 flex flex-col">
                      <Label className="text-sm font-semibold">ملاحظات المرحلة</Label>
                      <StageNotesField
                        initialNotes={stage.notes}
                        onSave={(notes) =>
                          handleSaveNotes(
                            stage.id,
                            notes,
                            stage.name,
                            stage.status,
                            stage.notes,
                          )
                        }
                      />
                    </div>
                  </div>
                </AccordionContent>}
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
  const [notes, setNotes] = useState(initialNotes || ".");
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
    <div className="space-y-2 flex-1 flex flex-col p-1">
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
