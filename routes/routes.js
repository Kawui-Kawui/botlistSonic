const { Router } = require("express");
const passport = require("../server/passport");
const { auth } = require("../util/middleware/auth");
const router = Router();
const guildShcema = require("../util/models/regisbot");
const Discord = require("discord.js");
const app = require("../server/express");
const { MessageButton } = require("discord-buttons");

try {
  router.get("/", async (req, res, next) => {
    let bots = [];
    let botsfind = await await guildShcema.find();
    botsfind.find((e) =>
      bots.push({
        name: e.name,
        id: e.id,
        avar: e.avar,
        invit: e.invit,
        desc1: e.desc1,
      })
    );

    console.log(bots);
    res.render("home", {
      user: req.user,
      esta: true,
      bots: bots,
    });
  });

  router.get(
    "/login",
    passport.authenticate("discord", {
      failureRedirect: `/`,
    }),
    (req, res) => {
      res.redirect("/");
    }
  );

  router.get("/register", (req, res) => {
    res.render("./web/registrar", {
      user: req,
      esta: true,
    });
  });
  router.post("/register/newBot", async (req, res) => {
    let id = req.params.id;
    let newPrefixPages = req.body;
    console.log(req.user.id);

    let user = req.BotClient.users.cache.find((e) => e.id === req.user.id);

    console.log(newPrefixPages);
    if (!req.body.id) {
      user.send("Coloca la id del bot");
      res.redirect("/register");
      return;
    }
    let a = await guildShcema.findOne({ id: req.body.id });
    if (!a) {
      if (!req.body.prefix) {
        user.send("No coloco el prefix");
        res.redirect("/register");
        return;
      }
      if (!req.body.desc1) {
        user.send("No coloco la descripcion breve");
        res.redirect("/register");
        return;
      }
      if (!req.body.desc2) {
        user.send("No coloco la descripcion Larga");
        res.redirect("/register");
        return;
      }
      if (!req.body.invit) {
        user.send("No coloco la invitacion");
        res.redirect("/register");
        return;
      }
      if (!req.body.avar) {
        user.send("No coloco el avatar");
        res.redirect("/register");
        return;
      }

      if (req.body.desc1.length >= 100) {
        user.send(
          "La descripcion corta es muy larga (Sobrepasa los 100 caracteres)"
        );
        res.redirect("/register");
        return;
      }
      if (req.body.desc1.length <= 10) {
        user.send(
          "La descripcion corta es muy corta (No llega a los 10 caracteres)"
        );
        res.redirect("/register");
        return;
      }

      if (req.body.desc2.length >= 3000) {
        user.send(
          "La descripcion larga es muy larga (Sobrepasa los 3000 caracteres)"
        );
        res.redirect("/register");
        return;
      }
      if (req.body.desc2.length <= 150) {
        user.send(
          "La descripcion larga es muy corta (No llega a los 150 caracteres)"
        );
        res.redirect("/register");
        return;
      }

      /**/
      const embedsend = new Discord.MessageEmbed()
        .setTimestamp()
        .setColor("BLUE")
        .setTitle("Bot registrado para aprobacion")
        .setDescription(
          "Espera a que un staff, si tienes algun error se te mandara un mensaje"
        );
      const registro1 = new Discord.MessageEmbed()
        .setTimestamp()
        .setColor("BLUE")
        .setTitle(`Bot registrado para aprobacion: <@!${req.body.id}>`)
        .setDescription(
          "Desc corta: " + req.body.desc1 + " Prefix: " + req.body.prefix
        )
        .addField("Desc larga", req.body.desc2)
        .setURL(req.body.invit)
        .setThumbnail(req.body.avar);

      let me = req.BotClient.guilds.cache
        .get("867137243822555166")
        .channels.cache.get("881566279138410546");
      let m = await me.send({ embed: registro1 });
      user.send({ embed: embedsend });

      req.BotClient.on("message", async (msg) => {
        let args = msg.content.slice("!".length).trim().split(" ");
        let command = args.shift().toLowerCase();
        let user = req.BotClient.users.cache.find((e) => e.id === req.user.id);
        if (command === "acept") {
          let sv = new guildShcema({
            id: req.body.id,
            prefix: req.body.prefix,
            name: req.body.name,
            desc1: req.body.desc1,
            desc2: req.body.desc2,
            invit: req.body.invit,
            owner: req.user.id,
            tags: req.body.tags,
            web: req.body.web,
            suport: req.body.support,
            avar: req.body.avar,
          });
          await sv.save();

          user.send("Tu bot fue aceptado");
          msg.channel.send("Bot aceptado");
        }
        if (command === "deny") {
          user.send(
            `Tu bot fue denegado por: ${args.join(" ")}, y por el staff ${
              msg.author.tag
            }`
          );
          msg.channel.send("Bot rechasado");
        }
      });
    } else {
      user.send("Ese bot ya esta registrado");
      res.redirect("/");
      return;
    }

    res.redirect("/");
  });
} catch (error) {}
module.exports = router;
