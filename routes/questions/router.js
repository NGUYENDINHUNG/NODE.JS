const express = require("express");
const router = express.Router();

const { validateSchema } = require("../../utitl");
const { q1, q3a } = require("./validation");
const {
  question1,
  question1a,
  question2a,
  question2b,
  question3,
  question3a,
  question3c,
  question3d,
  question4,
  question4a,
  question5,
  question5a,
  question6,
  question7,
  question8a,
  question8b,
  question8c,
  question11,
  question14,
  question13,
  question15,
  question16,
  question18,
  question19,
  question20,
  question21,
  question22,
  question23,
  question24,
  question25,
  question26,
  question29,
  question27,
  question28,
  question30,
  question31,
  questionTest,
  question32,
  question33,
  question34,
} = require("./controller");

router.get("/1", question1);
router.get("/1a", question1a);
router.get("/2a", question2a);
router.get("/2b", question2b);
router.get("/3", question3);
router.get("/3a", question3a);
router.get("/3c", question3c);
router.get("/3d", question3d);
router.get("/4", question4);
router.get("/4a", question4a);
router.get("/5", question5);
router.get("/5a", question5a);
router.get("/6", question6);
router.get("/7", question7);
router.get("/8a", question8a);
router.get("/8b", question8b);
router.get("/8c", question8c);
router.get("/11", question11);
router.get("/14", question14);
router.get("/13", question13);
router.get("/15", question15);
router.get("/16", question16);
router.get("/18", question18);
router.get("/19", question19);
router.get("/20", question20);
router.get("/21", question21);
router.get("/22", question22);
router.get("/23", question23);
router.get("/24", question24);
router.get("/25", question25);
router.get("/26", question26);
router.get("/29", question29);
router.get("/27", question27);
router.get("/28", question28);
router.get("/30", question30);
router.get("/31", question31);
router.get("/test", questionTest);
router.get("/32", question32);
router.get("/33", question33);
router.get("/34", question34);
module.exports = router;
