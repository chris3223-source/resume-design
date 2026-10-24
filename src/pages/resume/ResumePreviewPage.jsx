import React, { useEffect, useRef, useState } from "react";
import { App, Button, Tooltip } from "antd";
import {
  ArrowLeftOutlined,
  CloseOutlined,
  DownloadOutlined,
  EditOutlined,
  RightOutlined,
  FileTextOutlined,
} from "../../components/icons.js";
import {
  LeftOutlined,
  StepBackwardOutlined,
  StepForwardOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
  FullscreenOutlined,
} from "@ant-design/icons";
import "./resume-preview-page.css";

export function ResumePreviewPage({ doc, renderResume, onBack, onEdit }) {
  const { message } = App.useApp();
  const [zoom, setZoom] = useState(1);
  const viewport = useRef(null);
  function fit() {
    if (viewport.current)
      setZoom(
        Math.max(0.35, Math.min(1, (viewport.current.clientWidth - 56) / 794)),
      );
  }
  useEffect(() => {
    fit();
  }, []);
  return (
    <section className="standalone-preview">
      <header className="standalone-preview-heading">
        <FileTextOutlined />
        <strong>简历预览</strong>
        <span>示例内容</span>
      </header>
      <div className="standalone-preview-toolbar">
        <div className="preview-navigation">
          <Button
            type="text"
            size="small"
            icon={<ArrowLeftOutlined />}
            onClick={onBack}
          >
            返回
          </Button>
          <span className="preview-toolbar-divider" />
          <Tooltip title="第一页">
            <Button
              type="text"
              size="small"
              aria-label="第一页"
              disabled
              icon={<StepBackwardOutlined />}
            />
          </Tooltip>
          <Button
            type="text"
            size="small"
            aria-label="上一页"
            disabled
            icon={<LeftOutlined />}
          />
          <span className="preview-page-count">1 / 1</span>
          <Button
            type="text"
            size="small"
            aria-label="下一页"
            disabled
            icon={<RightOutlined />}
          />
          <Tooltip title="最后一页">
            <Button
              type="text"
              size="small"
              aria-label="最后一页"
              disabled
              icon={<StepForwardOutlined />}
            />
          </Tooltip>
          <span className="preview-toolbar-divider" />
          <Button
            type="text"
            size="small"
            aria-label="缩小"
            disabled={zoom <= 0.35}
            icon={<ZoomOutOutlined />}
            onClick={() =>
              setZoom((v) => Math.max(0.35, Math.round((v - 0.1) * 100) / 100))
            }
          />
          <button
            className="preview-zoom-reset"
            title="恢复100%"
            onClick={() => setZoom(1)}
          >
            {Math.round(zoom * 100)}%
          </button>
          <Button
            type="text"
            size="small"
            aria-label="放大"
            disabled={zoom >= 1.5}
            icon={<ZoomInOutlined />}
            onClick={() =>
              setZoom((v) => Math.min(1.5, Math.round((v + 0.1) * 100) / 100))
            }
          />
          <Tooltip title="适应宽度">
            <Button
              type="text"
              size="small"
              aria-label="适应宽度"
              icon={<FullscreenOutlined />}
              onClick={fit}
            />
          </Tooltip>
        </div>
        <strong className="preview-document-title" title={doc.title}>
          {doc.title}
        </strong>
        <div className="preview-toolbar-actions">
          <Button
            size="small"
            icon={<DownloadOutlined />}
            onClick={() =>
              message.info("下载 PDF 为原型入口，尚未执行真实导出")
            }
          >
            下载 PDF
          </Button>
          <Button
            size="small"
            type="primary"
            icon={<EditOutlined />}
            onClick={() => onEdit(doc)}
          >
            编辑简历
          </Button>
          <Button
            size="small"
            type="text"
            aria-label="关闭预览"
            icon={<CloseOutlined />}
            onClick={onBack}
          />
        </div>
      </div>
      <div className="standalone-preview-scroll" ref={viewport}>
        <div
          className="preview-paper-bounds"
          style={{ width: 794 * zoom, height: 1123 * zoom }}
        >
          <div
            className="preview-paper-content"
            style={{ transform: `scale(${zoom})` }}
          >
            {renderResume(doc)}
          </div>
        </div>
      </div>
    </section>
  );
}
