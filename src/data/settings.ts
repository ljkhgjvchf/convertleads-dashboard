/* Placeholder data for the Settings modal. */

export type ServerStatus = "ok" | "error" | "off";
export type McpServer = { id: string; name: string; color: string; status: ServerStatus; summary?: string; tools: string[]; log?: string };

const srv = (id: string, name: string, color: string, status: ServerStatus, tools: string[], summary?: string, log?: string): McpServer =>
  ({ id, name, color, status, tools, summary, log });

export const WORKSPACES = ["Home", "Studio", "Analytics", "Cloud"];

export const homeServers: Record<string, McpServer[]> = {
  Home: [
    srv("docs", "Docs search", "lab(60% 0 0)", "error", [], undefined, "Error: connect ECONNREFUSED 127.0.0.1:7331\n  at TCPConnectWrap.afterConnect\nServer exited with code 1"),
    srv("figma", "Figma", "var(--color-pink)", "ok", ["get_design_context", "get_metadata", "get_screenshot", "get_variable_defs", "create_new_file"], "26 tools, 1 prompt, 104 resources enabled"),
  ],
  Studio: [
    srv("linear", "Linear", "var(--color-violet-2)", "ok", ["list_issues", "create_issue", "update_issue", "list_projects"], "18 tools enabled"),
    srv("notion", "Notion", "lab(30% 0 0)", "ok", ["search", "fetch_page", "create_page", "update_page"], "12 tools, 3 prompts enabled"),
  ],
  Analytics: [
    srv("ga", "Google Analytics", "var(--color-yellow)", "off", ["run_report", "list_properties", "realtime"], "9 tools enabled"),
  ],
  Cloud: [],
};

export const pluginServers: McpServer[] = [
  srv("paper", "Paper", "var(--color-blue)", "error", [], undefined, "Error: plugin manifest missing \"entry\" field"),
  srv("posthog", "PostHog", "var(--color-green)", "ok", ["query_insights", "list_dashboards", "capture_event", "feature_flags", "session_recordings"], "521 tools, 173 resources enabled"),
  srv("vercel", "Vercel", "lab(10% 0 0)", "ok", ["list_deployments", "get_build_logs", "promote_deployment", "env_variables"], "30 tools, 13 prompts enabled"),
];

export type FileKind = "Documents" | "Spreadsheets" | "Videos" | "Images";
export type StoredFile = { id: number; name: string; kind: FileKind; date: string; size: number };

export const files: StoredFile[] = [
  { id: 1, name: "Invoice 1", kind: "Documents", date: "2026-11-11", size: 4_000_000 },
  { id: 2, name: "Payroll sheet", kind: "Spreadsheets", date: "2026-11-11", size: 539_000 },
  { id: 3, name: "Welcome video", kind: "Videos", date: "2026-11-10", size: 36_000_000 },
  { id: 4, name: "Brand guidelines", kind: "Documents", date: "2026-10-28", size: 2_100_000 },
  { id: 5, name: "Q3 report", kind: "Spreadsheets", date: "2026-10-02", size: 812_000 },
  { id: 6, name: "Logo pack", kind: "Images", date: "2026-09-19", size: 3_400_000 },
  { id: 7, name: "Product demo", kind: "Videos", date: "2026-09-04", size: 48_000_000 },
  { id: 8, name: "Meeting notes 22", kind: "Documents", date: "2026-08-21", size: 5_200_000 },
];

/** Files we pretend are stored besides the visible ones. */
export const OTHER_FILES = 1254;
