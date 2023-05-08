import axios from "axios";
import CryptoJS from "crypto-js";
import qs from "qs";
import { configZLP } from "../config";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
    return;
  }
  try {

    let postData = {
      appid: configZLP.app_id,
      reqtime: Date.now(),
    }

    const data = [postData.appid, postData.reqtime].join("|"); // appid|reqtime
    postData.mac = CryptoJS.HmacSHA256(data, configZLP.key1).toString();


    let postConfig = {
      method: 'post',
      url: configZLP.gateway_endpoint + 'api/getlistmerchantbanks',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: qs.stringify(postData)
    };

    axios(postConfig)
      .then(function (response) {
        res.status(200).json(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  } catch (err) {
    res.status(500).json({ statusCode: 500, message: err.message });
  }
}