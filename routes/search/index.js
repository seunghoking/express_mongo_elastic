import express from "express";
import { MonitoringData } from "../../models";
const router = express.Router();

// Set Elasticsearch
import { Client } from "@elastic/elasticsearch";
import Axios from "axios";
const esClient = new Client({
  node: process.env.ELASTICSEARCH_NODE_URL,
});

router.get("/data", async (req, res) => {
  try {
    // const skip = Number(req.body.currentPage) * Number(req.body.pageSize);
    // let sortQuery = { $sort: { "detailData.uploadedAt": "desc" } };
    // if (req.body.sortFilter) {
    //   const sortFilter = req.body.sortFilter;
    //   for (const key in sortFilter) {
    //     const obj = {};
    //     obj[`detailData.${key}`] = sortFilter[key];
    //     sortQuery["$sort"] = obj;
    //   }
    //   if (Object.values(sortQuery.$sort) === 1) {
    //     sortQuery.$sort[`detailData.${key}`] = "asc";
    //   } else {
    //     sortQuery.$sort[`detailData.${key}`] = "desc";
    //   }
    // }

    let result;
    if (req.body.searchInput) {
      console.log("searchInput 있음");
      result = await Promise.all([
        esClient.search({
          index: "monitoringdata",
          body: {
            sort: {
              "detailData.uploadedAt": "desc",
            },
            _source: [
              "detailData.content",
              "detailData.uploadedAt",
              "detailData.postTitle",
              "detailData.commentCount",
              "detailData.likeCount",
              "detailData.dislikeCount",
              "detailData.viewCount",
              "detailData.isTransaction",
              "trainedResult",
              "sentimentAnalysisResult",
              "brandId",
              "channelKeyname",
              "articleCode",
            ],
            query: {
              bool: {
                must: [
                  {
                    multi_match: {
                      query: req.body.searchInput,
                      fields: [
                        "detailData.content",
                        "detailData.contentPlainText",
                        "detailData.postTitle",
                      ],
                    },
                  },
                ],
                filter: [
                  {
                    term: {
                      brandId: "mcd",
                      // brandId: req.user.brandId,
                    },
                  },
                  {
                    terms: {
                      channelKeyname: ["naver-blog", "instagram"],
                      // channelKeyname: req.body.channels,
                    },
                  },
                  {
                    range: {
                      "detailData.uploadedAt": {
                        gte: 1596121199999,
                        lte: 1600786799999,
                      },
                    },
                    // range: {
                    //   "detailData.uploadedAt": {
                    //     gte: new Date(req.body.startAt).getTime(),
                    //     lte: new Date(req.body.endAt).getTime(),
                    //   },
                    // },
                  },
                  // {
                  //   bool: {
                  //     should: [
                  //       {
                  //         bool: {
                  //           filter: [
                  //             {
                  //               terms: {
                  //                 sentimentAnalysisResult: [0, 1, 2, 3],
                  //               },
                  //             },
                  //             {
                  //               term: {
                  //                 trainedResult: null,
                  //               },
                  //             },
                  //           ],
                  //         },
                  //       },
                  //       {
                  //         terms: {
                  //           trainedResult: [0, 1, 2, 3],
                  //         },
                  //       },
                  //     ],
                  //   },
                  // },
                ],
              },
            },
          },
        }),
        esClient.search({
          index: "monitoringdata",
          body: {
            sort: {
              "detailData.uploadedAt": "desc",
            },
            size: 0,
            query: {
              bool: {
                must: [
                  {
                    multi_match: {
                      query: req.body.searchInput,
                      fields: [
                        "detailData.content",
                        "detailData.contentPlainText",
                        "detailData.postTitle",
                      ],
                    },
                  },
                ],
                filter: [
                  {
                    term: {
                      brandId: "mcd",
                      // brandId: req.user.brandId,
                    },
                  },
                  {
                    terms: {
                      channelKeyname: ["naver-blog", "instagram"],
                      // channelKeyname: req.body.channels,
                    },
                  },
                  {
                    range: {
                      "detailData.uploadedAt": {
                        gte: 1596121199999,
                        lte: 1600786799999,
                      },
                    },
                    // range: {
                    //   "detailData.uploadedAt": {
                    //     gte: new Date(req.body.startAt).getTime(),
                    //     lte: new Date(req.body.endAt).getTime(),
                    //   },
                    // },
                  },
                  // {
                  //   bool: {
                  //     should: [
                  //       {
                  //         bool: {
                  //           filter: [
                  //             {
                  //               terms: {
                  //                 sentimentAnalysisResult: [0, 1, 2, 3],
                  //               },
                  //             },
                  //             {
                  //               term: {
                  //                 trainedResult: null,
                  //               },
                  //             },
                  //           ],
                  //         },
                  //       },
                  //       {
                  //         terms: {
                  //           trainedResult: [0, 1, 2, 3],
                  //         },
                  //       },
                  //     ],
                  //   },
                  // },
                ],
              },
            },
            aggs: {
              count_for_channels: {
                terms: {
                  field: "channelKeyname",
                },
              },
            },
          },
        }),
      ]);
    } else {
      console.log("searchInput 없음");
      result = await Promise.all([
        esClient.search({
          index: "monitoringdata",
          body: {
            _source: [
              "detailData.content",
              "detailData.uploadedAt",
              "detailData.postTitle",
              "detailData.commentCount",
              "detailData.likeCount",
              "detailData.dislikeCount",
              "detailData.viewCount",
              "detailData.isTransaction",
              "trainedResult",
              "sentimentAnalysisResult",
              "brandId",
              "channelKeyname",
              "articleCode",
            ],
            sort: {
              "detailData.uploadedAt": "desc",
            },
            query: {
              bool: {
                filter: [
                  {
                    term: {
                      brandId: "mcd",
                      // brandId: req.user.brandId,
                    },
                  },
                  {
                    terms: {
                      channelKeyname: ["naver-blog", "instagram"],
                      // channelKeyname: req.body.channels,
                    },
                  },
                  {
                    range: {
                      "detailData.uploadedAt": {
                        gte: 1596121199999,
                        lte: 1600786799999,
                      },
                    },
                    // range: {
                    //   "detailData.uploadedAt": {
                    //     gte: new Date(req.body.startAt).getTime(),
                    //     lte: new Date(req.body.endAt).getTime(),
                    //   },
                    // },
                  },
                  // {
                  //   bool: {
                  //     should: [
                  //       {
                  //         bool: {
                  //           filter: [
                  //             {
                  //               terms: {
                  //                 sentimentAnalysisResult: [0, 1, 2, 3],
                  //               },
                  //             },
                  //             {
                  //               term: {
                  //                 trainedResult: null,
                  //               },
                  //             },
                  //           ],
                  //         },
                  //       },
                  //       {
                  //         terms: {
                  //           trainedResult: [0, 1, 2, 3],
                  //         },
                  //       },
                  //     ],
                  //   },
                  // },
                ],
              },
            },
          },
        }),
        esClient.search({
          index: "monitoringdata",
          body: {
            sort: {
              "detailData.uploadedAt": "desc",
            },
            query: {
              bool: {
                filter: [
                  {
                    term: {
                      brandId: "mcd",
                      // brandId: req.user.brandId,
                    },
                  },
                  {
                    terms: {
                      channelKeyname: ["naver-blog", "instagram"],
                      // channelKeyname: req.body.channels,
                    },
                  },
                  {
                    range: {
                      "detailData.uploadedAt": {
                        gte: 1596121199999,
                        lte: 1600786799999,
                      },
                    },
                    // range: {
                    //   "detailData.uploadedAt": {
                    //     gte: new Date(req.body.startAt).getTime(),
                    //     lte: new Date(req.body.endAt).getTime(),
                    //   },
                    // },
                  },
                  // {
                  //   bool: {
                  //     should: [
                  //       {
                  //         bool: {
                  //           filter: [
                  //             {
                  //               terms: {
                  //                 sentimentAnalysisResult: [0, 1, 2, 3],
                  //               },
                  //             },
                  //             {
                  //               term: {
                  //                 trainedResult: null,
                  //               },
                  //             },
                  //           ],
                  //         },
                  //       },
                  //       {
                  //         terms: {
                  //           trainedResult: [0, 1, 2, 3],
                  //         },
                  //       },
                  //     ],
                  //   },
                  // },
                ],
              },
            },
            aggs: {
              count_for_channels: {
                terms: {
                  field: "channelKeyname",
                },
              },
            },
          },
        }),
      ]);
    }
    // result[0] = result[0].body.hits.hits.map((doc) => doc._source);
    // result[1] = result[1].body.aggregations.count_for_channels.buckets;
    res.status(200).send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

router.post("/data", async (req, res, next) => {
  const dataCount = await Axios.get(
    `${process.env.ELASTICSEARCH_NODE_URL}/monitoringdata/_count`
  );
  const cnt = dataCount.data.count;
  console.log(cnt);
  const result = await MonitoringData.find(
    {},
    { _id: false, "detailData._id": false }
  )
    .skip(cnt)
    .limit(6000);
  try {
    result.forEach((data) => {
      esClient.index({
        index: "monitoringdata",
        type: "_doc",
        body: data,
      });
    });
  } catch (err) {
    next(err);
  } finally {
    res.status(200).send("success insert data");
  }
});

export default router;

