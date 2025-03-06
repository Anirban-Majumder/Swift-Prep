// @ts-nocheck

import {
    CopilotRuntime,
    GroqAdapter,
    copilotRuntimeNextJSAppRouterEndpoint,
} from '@copilotkit/runtime';
import { Action } from "@copilotkit/shared";
import { NextRequest } from 'next/server';
//import { createClient } from '@/lib/supabase/server';

const myactions: Action<any>[] = [];

const serviceAdapter = new GroqAdapter({ model: "llama-3.3-70b-versatile", disableParallelToolCalls: true });
const runtime = new CopilotRuntime({
    actions: myactions,
});

export const POST = async (req: NextRequest) => {

    const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
        runtime,
        serviceAdapter,
        endpoint: '/api/copilotkit',
    });

    return handleRequest(req);
};