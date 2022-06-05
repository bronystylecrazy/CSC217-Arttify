import { Building } from '@/databases/model';
import { error, info } from '@/utils/handler';
import HttpStatus from '@/utils/httpStatus';
import axios from 'axios';
import express from 'express';
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const owner_id = req.user.id;
        const builds = await Building.find({ owner_id });
        return info(res, "Successfully get all builds!", builds);
    } catch (e) {
        return error(res, e.message ? e.message : e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const owner_id = req.user.id;
        const builds = await Building.find({ owner_id, repository_id: req.params.id });
        return info(res, "Successfully get build!", builds);
    } catch (e) {
        return error(res, e.message ? e.message : e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
});

export default router;