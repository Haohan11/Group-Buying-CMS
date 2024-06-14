import Star from "@/icon/star";
import StarEmpty from "@/icon/star-outline";

const Stars = ({ number: n }) => {
  const number = isNaN(+n) ? 1 : Math.min(Math.max(1, n), 5);

  return (
    <div className="hstack">
      {Array(number)
        .fill(true)
        .concat(Array(5 - number).fill(false))
        .map((fill, index) => (
          <div
            key={index}
            className={`d-inline-block lh-1 ${index !== 4 && "pe-1"}`}
          >
            {fill ? <Star /> : <StarEmpty />}
          </div>
        ))}
    </div>
  );
};

export default Stars;
