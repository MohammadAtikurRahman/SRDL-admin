const express = require("express");
const router = express.Router();
const multer = require("multer")
const upload = multer({ dest: 'uploads/' });

const {getEnumerator, userLogin} = require("./controllers/enumeratorController");

const {
    addBeneficiary,
    updateBeneficiary,
    getBeneficiaries,
    beneficiaryLogin,
    saveTestScore,
    saveTest,
    savePcInfo,
    saveVideoInfo,
    addBeneficiaryScore,
    addBeneficiaryInBulk,
    deleteBeneficiary,
    saveMultiScore,
} = require("./controllers/beneficiaryController");


const {
    saveCsvpc,
    findUserid,
    getAllbyid

} = require("./controllers/enumeratorController");


router.get("/enumerator/:id", getEnumerator);

router.get("/beneficiary", getBeneficiaries);
router.patch("/beneficiary/:id", updateBeneficiary);
router.post("/beneficiary", addBeneficiary);
router.delete("/beneficiary/:id", deleteBeneficiary);

router.post("/beneficiary/add/bulk", addBeneficiaryInBulk);

router.post("/save-test/add", saveTest);

router.post("/get-login", beneficiaryLogin); // beneficiary login
router.post("/get-score-saved", addBeneficiaryScore); // beneficiary login

router.post("/get-saved-multi-score", saveMultiScore); // beneficiary login

router.post("/save-score", addBeneficiaryScore); // beneficiary login

/* admin login api */
router.post("/login", userLogin);

router.post("/ben-score", saveTestScore);



router.post("/pcinfo",savePcInfo)
router.post("/videoinfo",saveVideoInfo)
router.post('/upload', upload.single('file'), saveCsvpc);

router.get('/userid',findUserid)
router.get('/get-all/:userId',getAllbyid)

module.exports = {router};
