import React, { useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw } from 'draft-js';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from 'draftjs-to-html';

function NewsEditor({ getCurrentContent }) {  // ✅ 正确写法：只解构 prop，不调用
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    
    return (
        <div>
            <Editor
                editorState={editorState}
                toolbarClassName="toolbarClassName"
                wrapperClassName="wrapperClassName"
                editorClassName="editorClassName"
                onEditorStateChange={setEditorState}  // 可以简写
                onBlur={() => {
                    const htmlContent = draftToHtml(
                        convertToRaw(editorState.getCurrentContent())
                    );
                    console.log(htmlContent);
                    // 如果父组件传递了 getCurrentContent，就调用它
                    if (getCurrentContent) {
                        getCurrentContent(htmlContent);
                    }
                }}
            />
        </div>
    );
}

export default NewsEditor;