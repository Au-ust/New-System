import React, { useEffect, useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw,ContentState} from 'draft-js';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import './NewsEditor.css'
function NewsEditor({ getCurrentContent ,content}) {  //只解构 prop，不调用
    const [editorState, setEditorState] = useState(EditorState.createEmpty());

   
  // 初始化编辑器内容,本来的写法是convertFromHTML，但是会报错
  useEffect(() => {
    if (content && content.trim() !== '') {
      try {
        const html = content;
        // 使用 htmlToDraft 转换 HTML 为 Draft.js 格式
        const contentBlock = htmlToDraft(html);

        // 检查转换是否成功
        if (contentBlock) {
          const contentState = ContentState.createFromBlockArray(
            contentBlock.contentBlocks,
            contentBlock.entityMap
          );
          const newEditorState = EditorState.createWithContent(contentState);
          setEditorState(newEditorState);
        }
      } catch (error) {
        console.error('初始化编辑器内容失败:', error);
        setEditorState(EditorState.createEmpty());
      }
    }
  }, [content]);

  const handleEditorChange = (newState) => {
    setEditorState(newState);
    const htmlContent = draftToHtml(convertToRaw(newState.getCurrentContent()));
    if (getCurrentContent) {
      getCurrentContent(htmlContent);
    }
  }; 
    return (
        <div>
            <Editor
                editorState={editorState}
                toolbarClassName="toolbarClassName"
                wrapperClassName="wrapperClassName"
                editorClassName="editorClassName"
                onEditorStateChange={handleEditorChange}
            />
        </div>
    );
}

export default NewsEditor;