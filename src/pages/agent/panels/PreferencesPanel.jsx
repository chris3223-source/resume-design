import { resumePreferenceDefaults } from "../../../mocks/resumes.js";
import React from "react";

import { Button, Form, Select, Radio } from "antd";

export function Preferences({ notify }) {
  return (
    <div className="panel-scroll">
      <div className="form-card">
        <h3>
          <span />
          求职意向
        </h3>
        <Form
          layout="vertical"
          initialValues={resumePreferenceDefaults}
          onFinish={() => notify("求职偏好已在本次演示中保存，刷新后重置")}
        >
          <Form.Item label="当前求职状态" name="status" required>
            <Radio.Group
              optionType="button"
              options={["在校生", "应届毕业生", "在职看机会", "已离职"]}
            />
          </Form.Item>
          <Form.Item label="求职类型" name="type" required>
            <Radio.Group
              optionType="button"
              options={["实习", "校招", "社招"]}
            />
          </Form.Item>
          <div className="form-grid">
            {[
              [
                "industry",
                "意向行业",
                ["互联网 / IT", "金融", "制造业", "教育"],
              ],
              [
                "job",
                "意向职能",
                ["前端开发工程师", "后端开发工程师", "产品经理"],
              ],
              ["city", "意向城市", ["杭州", "上海", "北京", "深圳", "广州"]],
              ["salary", "期望薪资", ["不限", "10–15K", "15–20K", "20–30K"]],
            ].map(([name, label, options]) => (
              <Form.Item key={name} label={label} name={name} required>
                <Select options={options.map((value) => ({ value }))} />
              </Form.Item>
            ))}
          </div>
          <Form.Item label="公司类型" name="company">
            <Radio.Group
              optionType="button"
              options={["不限", "国企", "上市公司", "外企", "民企", "创业公司"]}
            />
          </Form.Item>
          <Form.Item label="到岗时间" name="arrival" required>
            <Radio.Group
              optionType="button"
              options={["随时到岗", "一个月内", "毕业后"]}
            />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            保存偏好
          </Button>
        </Form>
      </div>
    </div>
  );
}
