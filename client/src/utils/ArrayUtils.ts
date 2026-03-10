export class ArrayUtils {
    public static shuffle<T>(arr: T[]): T[] {
        // Start from the last element and swap
        // one by one. We don't need to run for
        // the first element that's why i > 0
        let temp = [...arr];

        for (let i = temp.length - 1; i > 0; i--) {
            // Pick a random index from 0 to i inclusive
            let j = Math.floor(Math.random() * (i + 1));

            // Swap arr[i] with the element
            // at random index
            [temp[i], temp[j]] = [temp[j], temp[i]];
        }

        return temp;
    }
}