
exports.getDate = () => {
    const today = new Date;
	const options = {
		weekday: "long",
		day: "numeric",
		month: "long"
	};
	return today.toLocaleDateString("en-US", options);
};

exports.getDay = () => {
	var today = new Date;
	var options = {
		weekday: "long",
	};
	return today.toLocaleDateString("en-US", options);
};