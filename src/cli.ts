#!/usr/bin/env node
import { Command } from "commander";
import { devCommand } from "./commands/dev.js";
import { domainsCommand } from "./commands/domains.js";
import { logsCommand } from "./commands/logs.js";
import { sendCommand } from "./commands/send.js";
import { statusCommand } from "./commands/status.js";
import { templatesCommand } from "./commands/templates.js";
import { webhooksCommand } from "./commands/webhooks.js";

const program = new Command();

program
	.name("sendpigeon")
	.description("SendPigeon CLI - send emails and manage your account")
	.version("1.1.0");

program.addCommand(devCommand);
program.addCommand(domainsCommand);
program.addCommand(logsCommand);
program.addCommand(sendCommand);
program.addCommand(statusCommand);
program.addCommand(templatesCommand);
program.addCommand(webhooksCommand);

program.parse();
