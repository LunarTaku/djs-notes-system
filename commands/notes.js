const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  Client,
  EmbedBuilder,
  time,
} = require("discord.js");
const { Types } = require("mongoose");

const noteSchema = require("../../schemas/moderation/noteSchema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("note")
    .setDescription("Add a note to a user")
    .addSubcommand((subCmd) =>
      subCmd
        .setName("add")
        .setDescription("Add a note to a user.")
        .addUserOption((option) => {
          return option
            .setName("user")
            .setDescription("The user to add a note to.")
            .setRequired(true);
        })
        .addStringOption((option) => {
          return option
            .setName("note")
            .setDescription("The note to add to the user.")
            .setRequired(true)
            .setMaxLength(110)
        })
    )
    .addSubcommand((subCmd) =>
      subCmd
        .setName("remove")
        .setDescription("Remove a note from a user.")
        .addStringOption((option) => {
          return option
            .setName("id")
            .setDescription("The ID of the note.")
            .setRequired(true);
        })
    )
    .addSubcommand((subCmd) =>
      subCmd
        .setName("edit")
        .setDescription("Edit a note from a user.")
        .addStringOption((option) => {
          return option
            .setName("id")
            .setDescription("The ID of the note to edit.")
            .setRequired(true);
        })
        .addStringOption((option) => {
          return option
            .setName("note")
            .setDescription("The note to edit from a user.")
            .setRequired(true);
        })
    ),

  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { options, member, guild } = interaction;

    switch (options.getSubcommand()) {
      case "add":
        const note = options.getString("note");
        const usr = options.getUser("user");
        const noteTime = time();

        const newSchema = new noteSchema({
          _id: Types.ObjectId(),
          guildId: guild.id,
          userId: usr.id,
          note: note,
          moderator: member.user.id,
          noteDate: noteTime,
        });

        newSchema.save().catch((err) => console.log(err));

        await interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setTitle("Success")
              .setDescription(
                `Added a new note to a user!\n> Note: \`${note}\``
              )
              .setColor("#2f3136"),
          ],
          ephemeral: true,
        });
        break;

      case "remove":
        const noteId = options.getString("id");
        const data = await noteSchema.findById(noteId);

        const error = new EmbedBuilder()
          .setTitle("ERROR")
          .setDescription(
            `No notes matching \`${noteId}\` was found in the database.`
          )
          .setColor("Red");

        if (!data) await interaction.reply({ embeds: [error], ephemeral: true });

        data.delete();

        const success = new EmbedBuilder()
          .setTitle("Success")
          .setColor("Green")
          .setDescription(
            `Successfully removed the note from <@${data.userId}>!`
          );

        await interaction.reply({
          embeds: [success],
          ephemeral: true,
        });
        break;

      case "edit":
        const newNote = options.getString("note");
        const newId = options.getString("id");

        const newData = await noteSchema.findById(newId);

        const err = new EmbedBuilder()
          .setTitle("ERROR")
          .setDescription(
            `No notes matching \`${newId}\` was found in the database.`
          )
          .setColor("Red");

        if (!newData) await interaction.reply({ embeds: [err], ephemeral: true });

        await noteSchema.findOneAndUpdate(
          { guildId: guild.id, _id: newId },
          { note: newNote }
        );

        const suc = new EmbedBuilder()
          .setTitle("Success")
          .setColor("Green")
          .setDescription(
            `Successfully edited the note from <@${newData.userId}> to \`${newNote}\``
          );

        await interaction.reply({
          embeds: [suc],
          ephemeral: true,
        });
      default:
        break;
    }
  },
};
