const express = require('express');
const router = express.Router();
const networkLogic = require('logic/network.js');
const bitcoind = require('logic/bitcoind.js');
const auth = require('middlewares/auth.js');
const safeHandler = require('utils/safeHandler');

router.get('/mempool', auth.jwt, safeHandler((req, res) =>
  bitcoind.getMempoolInfo()
    .then(mempool => res.json(mempool.result))
));
router.get('/circulation', auth.jwt, safeHandler((req,res) =>
  bitcoind.getTxOutsetInfo()
    .then(circulation => res.json(circulation.result))

));
router.get('/addresses', auth.jwt, safeHandler((req, res) =>
  networkLogic.getBitcoindAddresses()
    .then(addresses => res.json(addresses))
));

router.get('/blockcount', auth.jwt, safeHandler((req, res) =>
  bitcoind.getBlockCount()
    .then(blockCount => res.json(blockCount))
));

router.get('/connections', auth.jwt, safeHandler((req, res) =>
  bitcoind.getConnectionsCount()
    .then(connections => res.json(connections))
));

//requires no authentication as it is used to fetch loading status
//which could be fetched at login/signup page
router.get('/status', safeHandler((req, res) =>
  bitcoind.getStatus()
    .then(status => res.json(status))
));

router.get('/sync', auth.jwt, safeHandler((req, res) =>
  bitcoind.getSyncStatus()
    .then(status => res.json(status))
));

router.get('/version', auth.jwt, safeHandler((req, res) =>
  bitcoind.getVersion()
    .then(version => res.json(version))
));

router.get('/statsDump', auth.jwt, safeHandler((req, res) =>
  bitcoind.nodeStatusDump()
    .then(statusdump => res.json(statusdump))
));

router.get('/stats', auth.jwt, safeHandler((req, res) =>
  bitcoind.nodeStatusSummary()
    .then(statussumarry => res.json(statussumarry))
));

router.get('/block', auth.jwt, safeHandler((req, res) => {
  if (req.query.hash !== undefined && req.query.hash !== null) {
    bitcoind.getBlock(req.query.hash)
      .then(blockhash => res.json(blockhash))
  } else if (req.query.height !== undefined && req.query.height !== null) {
    bitcoind.getBlockHash(req.query.height)
      .then(blockhash => res.json(blockhash))
  }
}
));

// /v1/bitcoind/info/block/<hash>
router.get('/block/:id', auth.jwt, safeHandler((req, res) =>
  bitcoind.getBlock(req.params.id)
    .then(blockhash => res.json(blockhash))
));

router.get('/blocks', auth.jwt, safeHandler((req, res) => {
  const fromHeight = parseInt(req.query.from);
  const toHeight = parseInt(req.query.to);
  bitcoind.getBlocks(fromHeight, toHeight)
    .then(blocks => res.json(blocks))
}
));

router.get('/txid/:id', auth.jwt, safeHandler((req, res) =>
  bitcoind.getTransaction(req.params.id)
    .then(txhash => res.json(txhash))
));

module.exports = router;
