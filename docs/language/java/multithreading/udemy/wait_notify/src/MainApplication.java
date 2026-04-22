private static final String INPUT_FILE = "./out/matrices";
private static final String OUTPUT_FILE = "./out/matrices_results.txt";
private static final int N = 10;

void main() throws IOException {
    ThreadSafeQueue threadSafeQueue = new ThreadSafeQueue();
    File inputFile = new File(INPUT_FILE);
    File outputFile = new File(OUTPUT_FILE);

    MatricesReaderProducer matricesReader = new MatricesReaderProducer(new FileReader(inputFile), threadSafeQueue);
    MatricesMultiplierConsumer matricesConsumer = new MatricesMultiplierConsumer(new FileWriter(outputFile), threadSafeQueue);

    matricesConsumer.start();
    matricesReader.start();
}

private static class MatricesMultiplierConsumer extends Thread {
    private ThreadSafeQueue queue;
    private FileWriter fileWriter;

    public MatricesMultiplierConsumer(FileWriter fileWriter, ThreadSafeQueue queue) {
        this.fileWriter = fileWriter;
        this.queue = queue;
    }

    @Override
    public void run() {
        while (true) {
            MatricesPair matricesPair = queue.remove();
            if (matricesPair == null) {
                IO.println("No more matrices to read from the queue, consumer is terminating");
                break;
            }

            float[][] result = multiplyMatrices(matricesPair.matrix1, matricesPair.matrix2);

            try {
                saveMatrixToFile(fileWriter, result);
            } catch (IOException e) {
            }
        }

        try {
            fileWriter.flush();
            fileWriter.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private float[][] multiplyMatrices(float[][] m1, float[][] m2) {
        float[][] result = new float[N][N];
        for (int r = 0; r < N; r++) {
            for (int c = 0; c < N; c++) {
                for (int k = 0; k < N; k++) {
                    result[r][c] += m1[r][k] * m2[k][c];
                }
            }
        }
        return result;
    }

    private static void saveMatrixToFile(FileWriter fileWriter, float[][] matrix) throws IOException {
        for (int r = 0; r < N; r++) {
            StringJoiner stringJoiner = new StringJoiner(", ");
            for (int c = 0; c < N; c++) {
                stringJoiner.add(String.format("%.2f", matrix[r][c]));
            }
            fileWriter.write(stringJoiner.toString());
            fileWriter.write('\n');
        }
        fileWriter.write('\n');
    }
}

private static class MatricesReaderProducer extends Thread {
    private Scanner scanner;
    private ThreadSafeQueue queue;

    public MatricesReaderProducer(FileReader reader, ThreadSafeQueue queue) {
        this.scanner = new Scanner(reader);
        this.queue = queue;
    }

    @Override
    public void run() {
        while (true) {
            float[][] matrix1 = readMatrix();
            float[][] matrix2 = readMatrix();
            if (matrix1 == null || matrix2 == null) {
                queue.terminate();
                IO.println("No more matrices to read. Producer Thread is terminating");
                return;
            }

            MatricesPair matricesPair = new MatricesPair();
            matricesPair.matrix1 = matrix1;
            matricesPair.matrix2 = matrix2;

            queue.add(matricesPair);
        }
    }

    private float[][] readMatrix() {
        float[][] matrix = new float[N][N];
        for (int r = 0; r < N; r++) {
            if (!scanner.hasNext()) {
                return null;
            }
            String[] line = scanner.nextLine().split(",");
            for (int c = 0; c < N; c++) {
                matrix[r][c] = Float.valueOf(line[c]);
            }
        }
        scanner.nextLine();
        return matrix;
    }
}

private static class ThreadSafeQueue {
    private Queue<MatricesPair> queue = new LinkedList<>();
    private boolean isEmpty = true;
    private boolean isTerminate = false;
    private static final int CAPACITY = 5; // back pressure

    /*
     * wait()과 notify()는 Object 클래스에 정의된 메서드로, 모든 객체가 가지고 있습니다. 이들은 반드시 synchronized 블록 내에서만 호출할 수 있습니다.
     * wait(): 현재 스레드를 일시정지시키고 객체의 모니터 락을 반납합니다. 다른 스레드가 notify()나 notifyAll()을 호출할 때까지 대기합니다.
     * notify(): 해당 객체의 모니터에서 대기 중인 스레드 중 하나를 깨웁니다.
     * notifyAll(): 해당 객체의 모니터에서 대기 중인 모든 스레드를 깨웁니다.
     */
    public synchronized void add(MatricesPair matricesPair) {
        /*
        * wait() 호출 시 if문이 아닌 while문을 사용해야 합니다. 이는 spurious wakeup(가짜 깨어남)을 방지하기 위함입니다.
        * */
        while (queue.size() == CAPACITY) {
            try {
                wait();
            } catch (InterruptedException e) {
            }
        }
        queue.add(matricesPair);
        isEmpty = false;
        notify();
    }

    public synchronized MatricesPair remove() {
        MatricesPair matricesPair = null;
        while (isEmpty && !isTerminate) {
            try {
                wait();
            } catch (InterruptedException e) {
            }
        }

        if (queue.size() == 1) {
            isEmpty = true;
        }

        if (queue.isEmpty() && isTerminate) {
            return null;
        }

        IO.println("queue size " + queue.size());

        matricesPair = queue.remove();
        if (queue.size() == CAPACITY - 1) {
            notifyAll();
        }
        return matricesPair;
    }

    public synchronized void terminate() {
        isTerminate = true;
        notifyAll();
    }
}

private static class MatricesPair {
    public float[][] matrix1;
    public float[][] matrix2;
}
