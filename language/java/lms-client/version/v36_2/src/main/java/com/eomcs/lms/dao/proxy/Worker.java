package com.eomcs.lms.dao.proxy;

import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;

// DaoProxyHelper가 작업을 수행할 때 일시적으로 사용하는 도구
// [DaoProxyHelper]--->[Worker]
// => 이런 관계를 UML에서는 의존관계라 부른다.

public interface Worker {
  Object excute(ObjectInputStream in, ObjectOutputStream out) throws Exception;
}
