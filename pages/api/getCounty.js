import countyData from "@/staticdata/county.json";

const county = countyData.reduce(
  (polymer, county) => ({
    countys: polymer.countys.concat(county.name),
    dict: polymer.dict.set(county.name, county.districts),
  }),
  { countys: [], dict: new Map() }
);

export default async function (req, res) {
  if (!req.query.id || !county.dict.has(county.countys[req.query.id]))
    res.status(200).json(county.countys);

  res.status(200).json(county.dict.get(county.countys[req.query.id]));
}
