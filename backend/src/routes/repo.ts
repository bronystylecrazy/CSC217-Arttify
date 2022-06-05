import { updateRepositorySetting } from './../services/repository';
import { createBasedOnRepository } from '@/services/repository';
import { error, info } from '@/utils/handler';
import HttpStatus from '@/utils/httpStatus';
import axios from 'axios';
import express from 'express';
import { Repository } from '@/databases/model';
const router = express.Router();

router.get('/', async (req, res) => {
    const page = req.query.page || 1;
    const per_page = req.query.per_page || 100;
    const { data } = await axios.get(`https://api.github.com/user/repos?type=owner`, {
        headers: {
            Authorization: `Token ${req?.user?.token}`,
        },
        params: {
            per_page,
            page
        }
    });
    return info(res, "Successfully repositories!", data);
});

router.post('/choose', async (req, res) => {
    try {
        return await createBasedOnRepository(req, res);
    } catch (e) {
        return error(res, e.message ? e.message : e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
});

router.post('/update', async (req, res) => {
    try {
        return await updateRepositorySetting(req, res);
    } catch (e) {
        return error(res, e.message ? e.message : e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
});

router.get('/project', async (req, res) => {
    try {
        const projects = await Repository.find({ owner_id: req.user.id });
        return info(res, "Successfully get all projects!", projects);
    } catch (e) {
        return error(res, e.message ? e.message : e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
});

export default router;