import { SlashCommandBuilder, MessageFlags } from 'discord.js';
import { addMoney } from '../../utils/economy.js';
import { isBotOwner } from '../../config/bot.js';
import { InteractionHelper } from '../../utils/interactionHelper.js';

const GRANT_AMOUNT = 1_000_000_000_000;

export default {
  data: new SlashCommandBuilder()
    .setName('grantcoins')
    .setDescription('One-time owner coin grant'),

  async execute(interaction, config, client) {
    await InteractionHelper.safeDefer(interaction, {
      flags: MessageFlags.Ephemeral,
    });

    if (!isBotOwner(interaction.user.id)) {
      return interaction.editReply('You are not authorized to use this command.');
    }

    if (!interaction.guildId) {
      return interaction.editReply('Use this command in a server.');
    }

    const result = await addMoney(
      client,
      interaction.guildId,
      interaction.user.id,
      GRANT_AMOUNT,
      'wallet',
    );

    await interaction.editReply(
      `Granted ${GRANT_AMOUNT.toLocaleString()} coins. Your wallet is now ${result.newBalance.toLocaleString()}.`,
    );
  },
};
