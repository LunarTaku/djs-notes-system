const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  Client,
  EmbedBuilder,
} = require("discord.js");

const noteSchema = require("../../schemas/moderation/noteSchema"); // change this to your path

module.exports = {
  data: new SlashCommandBuilder()
    .setName("logs")
    .setDescription("Get the logs of a user")
    .addSubcommand((subCmd) =>
      subCmd
        .setName("notes")
        .setDescription("Get the notes of a user")
        .addUserOption((option) => {
          return option
            .setName("user")
            .setDescription("User to get the notes logs from.")
            .setRequired(true);
        })
        .addIntegerOption((option) => {
          return option
            .setName("page")
            .setDescription("The page to display if there are more than 1")
            .setMinValue(2)
            .setMaxValue(20);
        })
    ),

  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    switch (interaction.options.getSubcommand()) {
      case "notes":
        {
          const user = interaction.options.getUser("user");
          const page = interaction.options.getInteger("page");

          const noteData = await noteSchema.find({
            userId: user.id,
            guildId: interaction.guild.id,
          });

          if (!noteData?.length)
            return interaction.reply({
              embeds: [
                new EmbedBuilder()
                  .setTitle("User Notes")
                  .setDescription(`${user} has no notes!`)
                  .setColor("Red"),
              ],
            });

          const embed = new EmbedBuilder()
            .setTitle(`${user.tag}'s notes!`)
            .setColor("#2f3136");

          // if the user selected a page
          if (page) {
            const pageNum = 5 * page - 5;

            if (noteData.length >= 6) {
              embed.setFooter({
                text: `page ${page} of ${Math.ceil(noteData.length / 5)}`,
              });
            }

            for (const notes of noteData.splice(pageNum, 5)) {
              const moderator = interaction.guild.members.cache.get(
                notes.moderator
              );

              embed.addFields({
                name: `<:note_emoji_2:1028290390194929814>  ${notes._id}`,
                value: `<:replycontinued:1015235683209707534> Note: \`${notes.note}\`\n<:replycontinued:1015235683209707534> Note Date: ${notes.noteDate}\n<:reply:1015235235195146301> Moderator: ${moderator}`,
              });
            }

            return await interaction.reply({ embeds: [embed] });
          }

          // if the user did not select a page
          if (noteData.length >= 6) {
            embed.setFooter({
              text: `page 1 of ${Math.ceil(noteData.length / 5)}`,
            });
          }

          for (const notes of noteData.slice(0, 5)) {
            const moderator = interaction.guild.members.cache.get(
              notes.moderator
            );

            embed.addFields({
              name: `<:note_emoji_2:1028290390194929814>  ${notes._id}`,
              value: `<:replycontinued:1015235683209707534> Note: \`${notes.note}\`\n<:replycontinued:1015235683209707534> Note Date: ${notes.noteDate}\n<:reply:1015235235195146301> Moderator: ${moderator}`,
            });
          }

          await interaction.reply({ embeds: [embed] });
        }
        break;

      default:
        break;
    }
  },
};
