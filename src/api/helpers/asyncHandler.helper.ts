async function asyncHandler<Type>(promise: Promise<Type>) {
  try {
    const data = await promise;
    return [data, null];
  } catch (error) {
    // console.error();
    return [null, error];
  }
}

export default asyncHandler;
