import { Spin, message, Typography } from "antd";
import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import axios from "axios";
import CryptoJS from "crypto-js";
import { configZLP } from "pages/api/config";

const { Paragraph } = Typography;

const Result = () => {
  const [secondsToGo, setSecondsToGo] = useState(60); // 1m - 15m timeout
  const router = useRouter();
  const { apptransid, appid, pmcid, bankcode, amount, discountamount, status, checksum } = router.query
  const dataStr = [appid, apptransid, pmcid, bankcode, amount, discountamount, status].join("|")

  let mac = CryptoJS.HmacSHA256(dataStr, configZLP.key2).toString();
  useEffect(() => {
    if (checksum === checksum) {
      let timer = setInterval(() => {
        if (secondsToGo > 0) {
          setSecondsToGo(secondsToGo - 1);
        }
        if (secondsToGo === 0) {
          clearInterval(timer);
          message
            .error("Out of time, please try again!")
            .then((r) => router.push("/cart"));
        }
      }, 1000); // interval check after 1s, simulate a countdown timer
      return () => {
        clearInterval(timer);
      };
    }

  });

  useEffect(() => {
    if (checksum === mac) {
      if (+router.query.status !== 1) {
        router.push("/status/error")
      }
      let checkPaymentStatus = setInterval(async () => {
        // interval query order ZLP status
        const res = await axios.post("/api/query_status", {
          appTransId: apptransid,
        });
        const returnCode = res.data.return_code;
        if (returnCode === 1) {
          clearInterval(checkPaymentStatus);
          router.push("/status/success");
        }
      }, 1000);
      return () => {
        clearInterval(checkPaymentStatus);
      };
    }

  });

  return (
    <>
      <Head>
        <title>Query order status </title>
      </Head>
      <div className="container xl:max-w-screen-xl mx-auto py-12 px-6">
        <div id="payment-modal">
          {checksum === mac ? (
            <div className="p-2 rounded-md max-w-md mx-auto">
              <Paragraph>
                <Spin style={{ paddingRight: '10px' }} />Your order is being processed.
              </Paragraph>
            </div>

          ) : (
            <div className="p-2 rounded-md bg-gray-100 text-gray-500 max-w-md mx-auto">Invalid redirect ...</div>
          )}
        </div>
      </div>

    </>
  );
};

export default Result;
