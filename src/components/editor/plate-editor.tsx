"use client";

import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { Plate } from "@udecode/plate/react";

import { useCreateEditor } from "@/components/editor/use-create-editor";
import { SettingsDialog } from "@/components/editor/settings";
import { Editor, EditorContainer } from "@/components/plate-ui/editor";

export function PlateEditor({
  onChange,
  value,
}: {
  onChange: (value: string) => void;
  value: string;
}) {
  const editor = useCreateEditor({ value });

  return (
    <DndProvider backend={HTML5Backend}>
      <Plate
        editor={editor}
        onChange={() => {
          onChange(
            editor.children.map((child) => child.children[0].text).join("\n"),
          );
        }}
      >
        <EditorContainer>
          <Editor variant="default" />
        </EditorContainer>

        <SettingsDialog />
      </Plate>
    </DndProvider>
  );
}
