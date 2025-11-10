import {
  CopilotRuntime,
  ExperimentalEmptyAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
} from "@copilotkit/runtime";

import { LangGraphHttpAgent } from "@ag-ui/langgraph"
import { NextRequest } from "next/server";

// 1. You can use any service adapter here for multi-agent support. We use
//    the empty adapter since we're only using one agent.
const serviceAdapter = new ExperimentalEmptyAdapter();

export const POST = async (req: NextRequest) => {
  // 2. Create the CopilotRuntime instance and utilize the LangGraph AG-UI
  //    integration to setup the connection.
  //    LangGraphHttpAgent will automatically forward properties (including authorization)
  //    to the LangGraph server, where they can be accessed via config.configurable
  const runtime = new CopilotRuntime({
    agents: {
      "agent_with_auth": new LangGraphHttpAgent({
        url: process.env.LANGGRAPH_DEPLOYMENT_URL || "http://localhost:8000",
      }),
    },
  });

  // 3. Build a Next.js API route that handles the CopilotKit runtime requests.
  //    The authorization property from CopilotKit properties will be automatically
  //    forwarded to the LangGraph server by LangGraphHttpAgent
  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime,
    serviceAdapter,
    endpoint: "/api/copilotkit",
  })

  return handleRequest(req)
}