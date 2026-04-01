package model;

import java.io.Serializable;
import java.util.Objects;

public class Document implements Serializable {
    private final String path;
    private final String name;
    private final String author;
    private final long size;

    private Document(Builder builder) {
        this.path = builder.path;
        this.name = builder.name;
        this.author = builder.author;
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

    public String getAuthor() {
        return author;
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
        if (!Objects.equals(name, document.name)) return false;
        return Objects.equals(author, document.author);
    }

    @Override
    public int hashCode() {
        int result = path != null ? path.hashCode() : 0;
        result = 31 * result + (name != null ? name.hashCode() : 0);
        result = 31 * result + (author != null ? author.hashCode() : 0);
        result = 31 * result + Long.hashCode(size);
        return result;
    }

    public static class Builder {
        private String path;
        private String name;
        private String author;
        private long size;

        public Builder path(String path) {
            this.path = path;
            return this;
        }

        public Builder name(String name) {
            this.name = name;
            return this;
        }

        public Builder author(String author) {
            this.author = author;
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
