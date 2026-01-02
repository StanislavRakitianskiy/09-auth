"use client";

import {
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import css from "./NoteForm.module.css";
import type { NoteTag } from "@/types/note";
import { createNote } from "@/lib/api";
import {
  initialDraft,
  useNoteStore,
  type NoteDraft,
} from "@/lib/store/noteStore";

type ValidationErrors = Partial<Record<keyof NoteDraft, ReactNode>>;

const tags: NoteTag[] = ["Todo", "Work", "Personal", "Meeting", "Shopping"];

export default function NoteForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { draft = initialDraft, setDraft, clearDraft } = useNoteStore();

  const [errors, setErrors] = useState<ValidationErrors>({});

  const createNoteMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      clearDraft();
      setErrors({});
      router.back();
    },
  });

  const handleChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = event.target;
    const fieldName = name as keyof NoteDraft;
    setDraft({ [fieldName]: value } as Partial<NoteDraft>);
    setErrors((prev) => ({ ...prev, [fieldName]: undefined }));
  };

  const validate = () => {
    const validationErrors: ValidationErrors = {};
    const trimmedTitle = draft.title.trim();
    const trimmedContent = draft.content.trim();

    if (!trimmedTitle) {
      validationErrors.title = "Title is required";
    } else if (trimmedTitle.length < 3) {
      validationErrors.title = "Minimum 3 characters";
    } else if (trimmedTitle.length > 50) {
      validationErrors.title = "Maximum 50 characters";
    }

    if (trimmedContent.length > 500) {
      validationErrors.content = "Maximum 500 characters";
    }

    if (!tags.includes(draft.tag)) {
      validationErrors.tag = "Tag is required";
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;

    createNoteMutation.mutate({
      title: draft.title.trim(),
      content: draft.content.trim(),
      tag: draft.tag,
    });
  };

  const handleCancelClick = () => {
    router.back();
  };

  return (
    <form className={css.form} onSubmit={handleSubmit}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          name="title"
          className={css.input}
          value={draft.title}
          onChange={handleChange}
          required
          minLength={3}
          maxLength={50}
        />
        {errors.title && <span className={css.error}>{errors.title}</span>}
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          rows={8}
          className={css.textarea}
          value={draft.content}
          onChange={handleChange}
          maxLength={500}
        />
        {errors.content && <span className={css.error}>{errors.content}</span>}
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          name="tag"
          className={css.select}
          value={draft.tag}
          onChange={handleChange}
        >
          {tags.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
        {errors.tag && <span className={css.error}>{errors.tag}</span>}
      </div>

      <div className={css.actions}>
        <button
          type="button"
          className={css.cancelButton}
          onClick={handleCancelClick}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={css.submitButton}
          disabled={createNoteMutation.isPending}
        >
          {createNoteMutation.isPending ? "Creating..." : "Create note"}
        </button>
      </div>

      {createNoteMutation.isError && (
        <p className={css.error}>
          {(createNoteMutation.error as Error)?.message ||
            "Failed to create note"}
        </p>
      )}
    </form>
  );
}