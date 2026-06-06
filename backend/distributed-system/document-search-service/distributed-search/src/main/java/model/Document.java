package model;

import java.io.Serializable;
import java.util.Objects;

public class Document implements Serializable {
    private final String path;
    private final String name;
    private final long size;

    private Document(Builder builder) {
        this.path = builder.path;
        this.name = builder.name;
        this.size = builder.size;
    }

    public static Builder builder() {
        return new Builder();
    }

    public String getPath() {
        return path;
    }

    public String getName() {
        return name;
    }


    public long getSize() {
        return size;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Document document = (Document) o;

        if (size != document.size) return false;
        if (!Objects.equals(path, document.path)) return false;
        return Objects.equals(name, document.name);
    }

    @Override
    public int hashCode() {
        int result = path != null ? path.hashCode() : 0;
        result = 31 * result + (name != null ? name.hashCode() : 0);
        result = 31 * result + Long.hashCode(size);
        return result;
    }

    public static class Builder {
        private String path;
        private String name;
        private long size;

        public Builder path(String path) {
            this.path = path;
            return this;
        }

        public Builder name(String name) {
            this.name = name;
            return this;
        }

        public Builder size(long size) {
            this.size = size;
            return this;
        }

        public Document build() {
            return new Document(this);
        }
    }
}
