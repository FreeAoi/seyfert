import type { ReturnCache } from '../cache';
import type { GuildRoleStructure, GuildStructure } from '../client';
import type { UsingClient } from '../commands';
import { Formatter, type MethodContext, type ObjectToLower } from '../common';
import type {
	APIRole,
	RESTPatchAPIGuildRoleJSONBody,
	RESTPatchAPIGuildRolePositionsJSONBody,
	RESTPostAPIGuildRoleJSONBody,
} from '../types';
import { DiscordBase } from './extra/DiscordBase';
import { PermissionsBitField } from './extra/Permissions';

export interface GuildRole extends DiscordBase, ObjectToLower<Omit<APIRole, 'permissions'>> {}

export class GuildRole extends DiscordBase {
	permissions: PermissionsBitField;
	constructor(
		client: UsingClient,
		data: APIRole,
		readonly guildId: string,
	) {
		super(client, data);
		this.permissions = new PermissionsBitField(BigInt(data.permissions));
	}

	guild(mode?: 'rest' | 'flow'): Promise<GuildStructure<'cached' | 'api'>>;
	guild(mode: 'cache'): ReturnCache<GuildStructure<'cached'> | undefined>;
	guild(mode: 'cache' | 'rest' | 'flow' = 'flow') {
		switch (mode) {
			case 'cache':
				return (
					this.client.cache.guilds?.get(this.guildId) ||
					(this.client.cache.adapter.isAsync ? (Promise.resolve() as any) : undefined)
				);
			default:
				return this.client.guilds.fetch(this.guildId, mode === 'rest');
		}
	}

	fetch(force = false): Promise<GuildRoleStructure> {
		return this.client.roles.fetch(this.guildId, this.id, force);
	}

	edit(body: RESTPatchAPIGuildRoleJSONBody): Promise<GuildRoleStructure> {
		return this.client.roles.edit(this.guildId, this.id, body);
	}

	delete(reason?: string) {
		return this.client.roles.delete(this.guildId, this.id, reason);
	}

	toString() {
		return Formatter.roleMention(this.id);
	}

	static methods(ctx: MethodContext<{ guildId: string }>) {
		return {
			create: (body: RESTPostAPIGuildRoleJSONBody): Promise<GuildRoleStructure> =>
				ctx.client.roles.create(ctx.guildId, body),
			list: (force = false): Promise<GuildRoleStructure[]> => ctx.client.roles.list(ctx.guildId, force),
			edit: (roleId: string, body: RESTPatchAPIGuildRoleJSONBody, reason?: string): Promise<GuildRoleStructure> =>
				ctx.client.roles.edit(ctx.guildId, roleId, body, reason),
			delete: (roleId: string, reason?: string) => ctx.client.roles.delete(ctx.guildId, roleId, reason),
			editPositions: (body: RESTPatchAPIGuildRolePositionsJSONBody): Promise<GuildRoleStructure[]> =>
				ctx.client.roles.editPositions(ctx.guildId, body),
		};
	}
}
